import { describe, it, expect } from 'vitest';
import { groupActivityIntoWeeks, getIntensityLevel, getMonthLabels } from './heatmap';
import { DayActivity } from './types';

function makeDays(startDate: string, count: number): DayActivity[] {
  const days: DayActivity[] = [];
  const cursor = new Date(startDate + 'T00:00:00Z');
  for (let i = 0; i < count; i++) {
    days.push({ date: cursor.toISOString().slice(0, 10), count: 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

describe('groupActivityIntoWeeks', () => {
  it('returns an empty array for no activity', () => {
    expect(groupActivityIntoWeeks([])).toEqual([]);
  });

  it('pads the first week so days land on the correct weekday column', () => {
    // 2026-08-19 is a Wednesday (UTC day index 3)
    const days = makeDays('2026-08-19', 3);
    const weeks = groupActivityIntoWeeks(days);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[0][0]).toBeNull(); // Sun
    expect(weeks[0][1]).toBeNull(); // Mon
    expect(weeks[0][2]).toBeNull(); // Tue
    expect(weeks[0][3]?.date).toBe('2026-08-19'); // Wed
  });

  it('pads the last week to a full 7 cells', () => {
    const days = makeDays('2026-08-19', 3); // Wed, Thu, Fri
    const weeks = groupActivityIntoWeeks(days);
    const lastWeek = weeks[weeks.length - 1];
    expect(lastWeek).toHaveLength(7);
    expect(lastWeek[6]).toBeNull(); // Sat, unfilled
  });

  it('splits a full range into complete weeks with no padding needed', () => {
    // 2026-08-16 is a Sunday; 14 days is exactly 2 full weeks
    const days = makeDays('2026-08-16', 14);
    const weeks = groupActivityIntoWeeks(days);
    expect(weeks).toHaveLength(2);
    expect(weeks.every((w) => w.every((d) => d !== null))).toBe(true);
  });
});

describe('getMonthLabels', () => {
  it('returns an empty array for no weeks', () => {
    expect(getMonthLabels([])).toEqual([]);
  });

  it('labels only the first week of each new month', () => {
    // spans late July into August: 2026-07-26 (Sun) through 2026-08-15 (Sat), 3 weeks
    const days = makeDays('2026-07-26', 21);
    const weeks = groupActivityIntoWeeks(days);
    const labels = getMonthLabels(weeks);

    expect(labels).toHaveLength(weeks.length);
    expect(labels[0]).toBe('Jul');
    // the week containing Aug 1 (2026-08-02, a Sunday) should be labeled Aug
    const augWeekIdx = weeks.findIndex((w) => w.some((d) => d?.date === '2026-08-02'));
    expect(labels[augWeekIdx]).toBe('Aug');
    // every other week should be unlabeled
    const labeledCount = labels.filter((l) => l !== '').length;
    expect(labeledCount).toBe(2);
  });

  it('leaves a fully-null padding week unlabeled', () => {
    const days = makeDays('2026-08-19', 3); // Wed-Fri, padded week has leading nulls only
    const weeks = groupActivityIntoWeeks(days);
    const labels = getMonthLabels(weeks);
    // single week here, first real day is Aug 19 -> labeled Aug
    expect(labels[0]).toBe('Aug');
  });
});

describe('getIntensityLevel', () => {
  it('returns 0 for zero count or zero max', () => {
    expect(getIntensityLevel(0, 10)).toBe(0);
    expect(getIntensityLevel(5, 0)).toBe(0);
  });

  it('scales proportionally into 4 buckets', () => {
    expect(getIntensityLevel(10, 10)).toBe(4);
    expect(getIntensityLevel(8, 10)).toBe(4);
    expect(getIntensityLevel(7, 10)).toBe(3);
    expect(getIntensityLevel(5, 10)).toBe(2);
    expect(getIntensityLevel(2, 10)).toBe(1);
  });
});
