import { describe, it, expect } from 'vitest';
import { computeStreaks } from './streak.service';

const TODAY = new Date('2026-08-19T12:00:00Z'); // a Wednesday

describe('computeStreaks', () => {
  it('returns zero streaks for no activity', () => {
    expect(computeStreaks([], TODAY)).toEqual({ currentStreak: 0, longestStreak: 0 });
  });

  it('counts a streak that includes today', () => {
    const dates = ['2026-08-17', '2026-08-18', '2026-08-19'];
    expect(computeStreaks(dates, TODAY)).toEqual({ currentStreak: 3, longestStreak: 3 });
  });

  it('keeps the streak alive if yesterday was solved but today has not been yet', () => {
    const dates = ['2026-08-16', '2026-08-17', '2026-08-18'];
    expect(computeStreaks(dates, TODAY).currentStreak).toBe(3);
  });

  it('breaks the streak once a full day is missed', () => {
    const dates = ['2026-08-10', '2026-08-11', '2026-08-15', '2026-08-16'];
    // gap between 08-11 and 08-15 breaks it; today (08-19) has nothing and
    // yesterday (08-18) has nothing either, so current streak is 0
    expect(computeStreaks(dates, TODAY).currentStreak).toBe(0);
  });

  it('finds the longest streak even when it is not the most recent one', () => {
    const dates = ['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-08-19'];
    expect(computeStreaks(dates, TODAY)).toEqual({ currentStreak: 1, longestStreak: 4 });
  });

  it('ignores duplicate dates', () => {
    const dates = ['2026-08-19', '2026-08-19', '2026-08-18'];
    expect(computeStreaks(dates, TODAY).currentStreak).toBe(2);
  });
});
