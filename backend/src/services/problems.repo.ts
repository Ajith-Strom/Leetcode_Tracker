import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';
import { Difficulty, Problem } from '../types';

export async function getAllSlugs(): Promise<Set<string>> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT leetcode_slug FROM problems');
  return new Set(rows.map((r) => r.leetcode_slug as string));
}

export async function upsertProblem(params: {
  title: string;
  slug: string;
  difficulty: Difficulty;
  firstSolvedDate: string; // YYYY-MM-DD
}): Promise<number> {
  const { title, slug, difficulty, firstSolvedDate } = params;
  await pool.query(
    `INSERT INTO problems (title, leetcode_slug, difficulty, first_solved_date)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), difficulty = VALUES(difficulty)`,
    [title, slug, difficulty, firstSolvedDate]
  );
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM problems WHERE leetcode_slug = ?',
    [slug]
  );
  return rows[0].id as number;
}

export async function upsertTag(name: string): Promise<number> {
  await pool.query('INSERT IGNORE INTO tags (name) VALUES (?)', [name]);
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM tags WHERE name = ?', [name]);
  return rows[0].id as number;
}

export async function linkProblemTag(problemId: number, tagId: number): Promise<void> {
  await pool.query('INSERT IGNORE INTO problems_tags (problem_id, tag_id) VALUES (?, ?)', [
    problemId,
    tagId,
  ]);
}

export async function getAllProblems(): Promise<Problem[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.title, p.leetcode_slug, p.difficulty, p.first_solved_date,
            GROUP_CONCAT(t.name) AS tag_names
     FROM problems p
     LEFT JOIN problems_tags pt ON pt.problem_id = p.id
     LEFT JOIN tags t ON t.id = pt.tag_id
     GROUP BY p.id
     ORDER BY p.first_solved_date DESC`
  );
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    leetcode_slug: r.leetcode_slug,
    difficulty: r.difficulty,
    first_solved_date: r.first_solved_date,
    tags: r.tag_names ? (r.tag_names as string).split(',') : [],
  }));
}

export async function getProblemById(id: number): Promise<Problem | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.title, p.leetcode_slug, p.difficulty, p.first_solved_date,
            GROUP_CONCAT(t.name) AS tag_names
     FROM problems p
     LEFT JOIN problems_tags pt ON pt.problem_id = p.id
     LEFT JOIN tags t ON t.id = pt.tag_id
     WHERE p.id = ?
     GROUP BY p.id`,
    [id]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    leetcode_slug: r.leetcode_slug,
    difficulty: r.difficulty,
    first_solved_date: r.first_solved_date,
    tags: r.tag_names ? (r.tag_names as string).split(',') : [],
  };
}
