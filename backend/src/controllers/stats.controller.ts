import { Request, Response } from 'express';
import { pool } from '../db/pool';
import { RowDataPacket } from 'mysql2';
import { getActivityCalendar, computeStreaks } from '../services/streak.service';

export async function getTagStats(_req: Request, res: Response) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.name, COUNT(*) AS count
     FROM problems_tags pt
     JOIN tags t ON t.id = pt.tag_id
     GROUP BY t.name
     ORDER BY count DESC`
  );
  res.json(rows);
}

export async function getStreakStats(req: Request, res: Response) {
  const rangeDays = Number(req.query.days) || 365;
  const activity = await getActivityCalendar(rangeDays);
  const solvedDates = activity.filter((d) => d.count > 0).map((d) => d.date);
  const { currentStreak, longestStreak } = computeStreaks(solvedDates);
  res.json({ activity, currentStreak, longestStreak });
}

const CONFIDENCE_LABELS: Record<number, string> = {
  1: 'Struggled',
  2: 'Shaky',
  3: 'Satisfactory',
  4: 'Mastered',
};

export async function getConfidenceStats(_req: Request, res: Response) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT confidence_score, COUNT(*) AS count
     FROM notes
     WHERE type = 'review' AND confidence_score IS NOT NULL
     GROUP BY confidence_score
     ORDER BY confidence_score`
  );
  res.json(
    rows.map((r) => ({
      confidence: r.confidence_score,
      label: CONFIDENCE_LABELS[r.confidence_score],
      count: r.count,
    }))
  );
}

export async function getDifficultyProgression(_req: Request, res: Response) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT DATE_FORMAT(first_solved_date, '%Y-%m') AS month, difficulty, COUNT(*) AS count
     FROM problems
     GROUP BY month, difficulty`
  );

  const months = [...new Set(rows.map((r) => r.month as string))].sort();
  const byMonth = new Map<string, { Easy: number; Medium: number; Hard: number }>(
    months.map((m) => [m, { Easy: 0, Medium: 0, Hard: 0 }])
  );
  for (const r of rows) {
    byMonth.get(r.month)![r.difficulty as 'Easy' | 'Medium' | 'Hard'] = r.count;
  }

  res.json(months.map((month) => ({ month, ...byMonth.get(month)! })));
}
