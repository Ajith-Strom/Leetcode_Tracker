import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime } from './format';

describe('formatDate', () => {
  it('formats a date string in a fixed en-US locale', () => {
    expect(formatDate('2026-08-15T00:00:00.000Z')).toBe('Aug 15, 2026');
  });
});

describe('formatDateTime', () => {
  it('includes both date and time', () => {
    const result = formatDateTime('2026-08-15T12:30:00.000Z');
    expect(result).toContain('Aug 15, 2026');
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});
