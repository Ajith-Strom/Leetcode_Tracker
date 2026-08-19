import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';
import { getAppToday } from '../utils/date';

export interface DayActivity {
  date: string; // YYYY-MM-DD
  count: number;
}

export async function getActivityCalendar(rangeDays: number): Promise<DayActivity[]> {
  const today = getAppToday();

  // DATE_FORMAT returns a plain string from MySQL, sidestepping mysql2's
  // local-timezone conversion of DATE columns into JS Date objects.
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT DATE_FORMAT(first_solved_date, '%Y-%m-%d') AS date, COUNT(*) AS count
     FROM problems
     WHERE first_solved_date >= DATE_SUB(?, INTERVAL ? DAY)
     GROUP BY date`,
    [today, rangeDays]
  );

  const countByDate = new Map<string, number>(rows.map((r) => [r.date as string, r.count as number]));

  const todayDate = new Date(today + 'T00:00:00Z');

  const result: DayActivity[] = [];
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    result.push({ date: dateStr, count: countByDate.get(dateStr) ?? 0 });
  }
  return result;
}

// Pure, deterministic given `todayStr` (injectable for tests): computes the
// current streak (consecutive solved days ending today or yesterday --
// a streak isn't broken until a full day passes with nothing solved) and
// the longest streak of consecutive solved days in the given date set.
export function computeStreaks(
  solvedDates: string[],
  todayStr: string = getAppToday()
): { currentStreak: number; longestStreak: number } {
  const dateSet = new Set(solvedDates);
  if (dateSet.size === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...dateSet].sort();
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00Z');
    const curr = new Date(sorted[i] + 'T00:00:00Z');
    const diffDays = (curr.getTime() - prev.getTime()) / 86_400_000;
    run = diffDays === 1 ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
  }

  const cursor = new Date(todayStr + 'T00:00:00Z');
  if (!dateSet.has(todayStr)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let currentStreak = 0;
  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    currentStreak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return { currentStreak, longestStreak };
}
