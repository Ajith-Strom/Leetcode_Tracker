import { DayActivity } from './types';

// Buckets a contiguous run of days (assumed to start at any weekday) into
// Sunday-first weeks for a GitHub-style calendar grid, padding the first
// and last week with nulls so every row has exactly 7 cells.
export function groupActivityIntoWeeks(activity: DayActivity[]): (DayActivity | null)[][] {
  if (activity.length === 0) return [];

  const weeks: (DayActivity | null)[][] = [];
  let currentWeek: (DayActivity | null)[] = [];

  const firstDayOfWeek = new Date(activity[0].date + 'T00:00:00Z').getUTCDay();
  for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null);

  for (const day of activity) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return weeks;
}

// Maps a day's solve count to a 0-4 intensity bucket relative to the
// busiest day in the visible range, for a 5-shade color scale.
export function getIntensityLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0 || maxCount === 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}
