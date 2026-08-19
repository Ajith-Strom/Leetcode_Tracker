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
  last_revised: string;
  days_since: number;
}

export async function getRevisionIntervalDays(): Promise<number> {
  const value = await getSetting(REVISION_INTERVAL_KEY);
  return value ? Number(value) : DEFAULT_INTERVAL_DAYS;
}

export async function setRevisionIntervalDays(days: number): Promise<void> {
  await setSetting(REVISION_INTERVAL_KEY, String(days));
}

export async function getDueProblems(): Promise<DueProblem[]> {
  const intervalDays = await getRevisionIntervalDays();

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.title, p.leetcode_slug, p.difficulty,
            COALESCE(MAX(n.created_at), p.first_solved_date) AS last_revised,
            DATEDIFF(CURDATE(), COALESCE(MAX(n.created_at), p.first_solved_date)) AS days_since
     FROM problems p
     LEFT JOIN notes n ON n.problem_id = p.id AND n.type = 'review'
     GROUP BY p.id
     HAVING days_since > ?
     ORDER BY days_since DESC`,
    [intervalDays]
  );

  return rows as DueProblem[];
}
