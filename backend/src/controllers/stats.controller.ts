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
