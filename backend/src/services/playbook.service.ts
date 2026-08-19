import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';

export interface PlaybookNote {
  content: string;
  confidence_score: number | null;
  created_at: string;
}

export interface PlaybookProblem {
  id: number;
  title: string;
  leetcode_slug: string;
  difficulty: string;
  notes: PlaybookNote[];
}

export interface PlaybookTopic {
  topic: string;
  problems: PlaybookProblem[];
}

// Compiles every review note into a topic-grouped playbook: only problems
// with at least one review note appear, since an untouched problem has
// nothing to compile into a cheatsheet yet.
export async function getPlaybook(): Promise<PlaybookTopic[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.name AS topic, p.id AS problem_id, p.title, p.leetcode_slug, p.difficulty,
            n.content, n.confidence_score, n.created_at
     FROM notes n
     JOIN problems p ON p.id = n.problem_id
     JOIN problems_tags pt ON pt.problem_id = p.id
     JOIN tags t ON t.id = pt.tag_id
     WHERE n.type = 'review'
     ORDER BY t.name, p.title, n.created_at DESC`
  );

  const topicMap = new Map<string, Map<number, PlaybookProblem>>();

  for (const r of rows) {
    if (!topicMap.has(r.topic)) topicMap.set(r.topic, new Map());
    const problemsInTopic = topicMap.get(r.topic)!;

    if (!problemsInTopic.has(r.problem_id)) {
      problemsInTopic.set(r.problem_id, {
        id: r.problem_id,
        title: r.title,
        leetcode_slug: r.leetcode_slug,
        difficulty: r.difficulty,
        notes: [],
      });
    }

    problemsInTopic.get(r.problem_id)!.notes.push({
      content: r.content,
      confidence_score: r.confidence_score,
      created_at: r.created_at,
    });
  }

  return Array.from(topicMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([topic, problems]) => ({
      topic,
      problems: Array.from(problems.values()),
    }));
}
