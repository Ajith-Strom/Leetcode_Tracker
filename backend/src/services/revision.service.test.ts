import { describe, it, expect } from 'vitest';
import { computeNextIntervalDays } from './revision.service';

describe('computeNextIntervalDays', () => {
  it('confidence 1 (Struggled) always returns 3 days regardless of history', () => {
    expect(computeNextIntervalDays(1, 0)).toBe(3);
    expect(computeNextIntervalDays(1, 60)).toBe(3);
  });

  it('confidence 2 (Shaky) always returns 7 days regardless of history', () => {
    expect(computeNextIntervalDays(2, 0)).toBe(7);
    expect(computeNextIntervalDays(2, 60)).toBe(7);
  });

  it('confidence 3 (Satisfactory) always returns 14 days regardless of history', () => {
    expect(computeNextIntervalDays(3, 0)).toBe(14);
    expect(computeNextIntervalDays(3, 60)).toBe(14);
  });

  it('confidence 4 (Mastered) floors at 30 days on first mastery', () => {
    expect(computeNextIntervalDays(4, 0)).toBe(30);
    expect(computeNextIntervalDays(4, 14)).toBe(30); // 14*2=28, still below the 30 floor
  });

  it('confidence 4 (Mastered) doubles the previous interval once past the floor', () => {
    expect(computeNextIntervalDays(4, 30)).toBe(60);
    expect(computeNextIntervalDays(4, 60)).toBe(120);
  });

  it('rejects an out-of-range confidence value', () => {
    expect(() => computeNextIntervalDays(0, 14)).toThrow();
    expect(() => computeNextIntervalDays(5, 14)).toThrow();
  });
});
