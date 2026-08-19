import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';
import { getSetting, setSetting } from './settings.repo';
import { getAppToday } from '../utils/date';

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
  next_due_date: string;
  days_since: number;
  is_overridden: boolean;
  content: string | null;
  is_paid_only: boolean;
}

export interface ScheduledProblem {
  id: number;
  title: string;
  leetcode_slug: string;
  difficulty: string;
  tags: string[];
  last_revised: string;
  interval_days: number;
  next_due_date: string;
  days_until_due: number;
  is_overridden: boolean;
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
// 2 = Shaky -> got it, but not confidently (7 days)
// 3 = Satisfactory -> standard interval (14 days)
// 4 = Mastered -> long interval, doubling on repeated mastery (min 30 days)
export function computeNextIntervalDays(confidence: number, previousIntervalDays: number): number {
  switch (confidence) {
    case 1:
      return 3;
    case 2:
      return 7;
    case 3:
      return 14;
    case 4:
      return Math.max(30, previousIntervalDays * 2);
    default:
      throw new Error('confidence must be 1, 2, 3, or 4');
  }
}

// Shared by getDueProblems/getRevisionSchedule: each problem's next review
// date is the algorithm's computed date (last review + its interval, or the
// global default for never-reviewed problems), unless a manual reschedule
// (override_due_date) is set, which takes priority until the next real
// review clears it.
const NEXT_DUE_DATE_SQL = `
  COALESCE(
    p.override_due_date,
    DATE_ADD(COALESCE(n.created_at, p.first_solved_date), INTERVAL COALESCE(n.interval_days, ?) DAY)
  )
`;

const BASE_JOIN_SQL = `
  FROM problems p
  LEFT JOIN notes n ON n.id = (
    SELECT n2.id FROM notes n2
    WHERE n2.problem_id = p.id AND n2.type = 'review'
    ORDER BY n2.created_at DESC, n2.id DESC LIMIT 1
  )
  LEFT JOIN problems_tags pt ON pt.problem_id = p.id
  LEFT JOIN tags t ON t.id = pt.tag_id
`;

export async function getDueProblems(): Promise<DueProblem[]> {
  const defaultIntervalDays = await getRevisionIntervalDays();
  const today = getAppToday();

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.title, p.leetcode_slug, p.difficulty, p.content, p.is_paid_only,
            p.override_due_date,
            GROUP_CONCAT(DISTINCT t.name) AS tag_names,
            COALESCE(n.created_at, p.first_solved_date) AS last_revised,
            COALESCE(n.interval_days, ?) AS effective_interval_days,
            ${NEXT_DUE_DATE_SQL} AS next_due_date,
            DATEDIFF(?, ${NEXT_DUE_DATE_SQL}) AS days_since
     ${BASE_JOIN_SQL}
     GROUP BY p.id, n.created_at, n.interval_days, p.override_due_date
     HAVING days_since >= 0
     ORDER BY days_since DESC`,
    [defaultIntervalDays, defaultIntervalDays, today, defaultIntervalDays]
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    leetcode_slug: r.leetcode_slug,
    difficulty: r.difficulty,
    tags: r.tag_names ? (r.tag_names as string).split(',') : [],
    last_revised: r.last_revised,
    interval_days: r.effective_interval_days,
    next_due_date: r.next_due_date,
    days_since: r.days_since,
    is_overridden: r.override_due_date !== null,
    content: r.content,
    is_paid_only: Boolean(r.is_paid_only),
  }));
}

// Every problem's next scheduled review date (past or future), sorted soonest
// first -- overdue problems naturally sort to the top since their computed
// date already lies in the past.
export async function getRevisionSchedule(): Promise<ScheduledProblem[]> {
  const defaultIntervalDays = await getRevisionIntervalDays();
  const today = getAppToday();

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.title, p.leetcode_slug, p.difficulty, p.override_due_date,
            GROUP_CONCAT(DISTINCT t.name) AS tag_names,
            COALESCE(n.created_at, p.first_solved_date) AS last_revised,
            COALESCE(n.interval_days, ?) AS effective_interval_days,
            ${NEXT_DUE_DATE_SQL} AS next_due_date,
            DATEDIFF(${NEXT_DUE_DATE_SQL}, ?) AS days_until_due
     ${BASE_JOIN_SQL}
     GROUP BY p.id, n.created_at, n.interval_days, p.override_due_date
     ORDER BY next_due_date ASC`,
    [defaultIntervalDays, defaultIntervalDays, defaultIntervalDays, today]
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    leetcode_slug: r.leetcode_slug,
    difficulty: r.difficulty,
    tags: r.tag_names ? (r.tag_names as string).split(',') : [],
    last_revised: r.last_revised,
    interval_days: r.effective_interval_days,
    next_due_date: r.next_due_date,
    days_until_due: r.days_until_due,
    is_overridden: r.override_due_date !== null,
  }));
}
