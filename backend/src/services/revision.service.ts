import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';
import { getSetting, setSetting } from './settings.repo';

const REVISION_INTERVAL_KEY = 'revision_interval_days';
const DEFAULT_INTERVAL_DAYS = 14;

export interface DueProblem {
  id: number;
  title: string;
  leetcode_slug: string;
  difficulty: string;
  tags: string[];
  last_revised: string;
  interval_days: number;
  days_since: number;
}

export async function getRevisionIntervalDays(): Promise<number> {
  const value = await getSetting(REVISION_INTERVAL_KEY);
  return value ? Number(value) : DEFAULT_INTERVAL_DAYS;
}

export async function setRevisionIntervalDays(days: number): Promise<void> {
  await setSetting(REVISION_INTERVAL_KEY, String(days));
}

// Confidence-based adaptive spaced repetition:
// 1 = Struggled -> review again soon (3 days)
// 2 = Satisfactory -> standard interval (14 days)
// 3 = Mastered -> long interval, doubling on repeated mastery (min 30 days)
export function computeNextIntervalDays(confidence: number, previousIntervalDays: number): number {
  switch (confidence) {
    case 1:
      return 3;
    case 2:
      return 14;
    case 3:
      return Math.max(30, previousIntervalDays * 2);
    default:
      throw new Error('confidence must be 1, 2, or 3');
  }
}

export async function getDueProblems(): Promise<DueProblem[]> {
  const defaultIntervalDays = await getRevisionIntervalDays();

  // Correlated subquery picks each problem's single latest review note (if any);
  // its interval_days drives the adaptive due date, falling back to the global
  // default for problems never reviewed (or reviewed without a confidence rating).
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.title, p.leetcode_slug, p.difficulty,
            GROUP_CONCAT(DISTINCT t.name) AS tag_names,
            COALESCE(n.created_at, p.first_solved_date) AS last_revised,
            COALESCE(n.interval_days, ?) AS effective_interval_days,
            DATEDIFF(CURDATE(), COALESCE(n.created_at, p.first_solved_date)) AS days_since
     FROM problems p
     LEFT JOIN notes n ON n.id = (
       SELECT n2.id FROM notes n2
       WHERE n2.problem_id = p.id AND n2.type = 'review'
       ORDER BY n2.created_at DESC LIMIT 1
     )
     LEFT JOIN problems_tags pt ON pt.problem_id = p.id
     LEFT JOIN tags t ON t.id = pt.tag_id
     GROUP BY p.id, n.created_at, n.interval_days
     HAVING days_since > effective_interval_days
     ORDER BY days_since DESC`,
    [defaultIntervalDays]
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    leetcode_slug: r.leetcode_slug,
    difficulty: r.difficulty,
    tags: r.tag_names ? (r.tag_names as string).split(',') : [],
    last_revised: r.last_revised,
    interval_days: r.effective_interval_days,
    days_since: r.days_since,
  }));
}
