import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';

export interface Pattern {
  id: number;
  name: string;
}

export async function getAllPatterns(): Promise<Pattern[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name FROM patterns ORDER BY name');
  return rows as Pattern[];
}

export async function getPatternsForProblem(problemId: number): Promise<Pattern[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT pt.id, pt.name FROM patterns pt
     JOIN problem_patterns pp ON pp.pattern_id = pt.id
     WHERE pp.problem_id = ?
     ORDER BY pt.name`,
    [problemId]
  );
  return rows as Pattern[];
}

export async function upsertPattern(name: string): Promise<number> {
  await pool.query('INSERT IGNORE INTO patterns (name) VALUES (?)', [name]);
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM patterns WHERE name = ?', [
    name,
  ]);
  return rows[0].id as number;
}

export async function attachPatternToProblem(problemId: number, patternId: number): Promise<void> {
  await pool.query(
    'INSERT IGNORE INTO problem_patterns (problem_id, pattern_id) VALUES (?, ?)',
    [problemId, patternId]
  );
}

export async function detachPatternFromProblem(
  problemId: number,
  patternId: number
): Promise<void> {
  await pool.query('DELETE FROM problem_patterns WHERE problem_id = ? AND pattern_id = ?', [
    problemId,
    patternId,
  ]);
}
