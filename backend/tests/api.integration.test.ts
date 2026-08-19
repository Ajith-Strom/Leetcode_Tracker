import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';

// Uses a dedicated, uniquely-slugged test problem so these tests never touch
// real synced LeetCode data, and cleans up everything it creates afterward.
const TEST_SLUG = `vitest-test-problem-${Date.now()}`;
const TEST_PATTERN_NAME = `vitest-test-pattern-${Date.now()}`;
let problemId: number;

beforeAll(async () => {
  const [result] = await pool.query(
    `INSERT INTO problems (title, leetcode_slug, difficulty, first_solved_date)
     VALUES (?, ?, 'Easy', CURDATE())`,
    ['Vitest Test Problem', TEST_SLUG]
  );
  problemId = (result as { insertId: number }).insertId;
});

afterAll(async () => {
  // ON DELETE CASCADE on problems cleans up its notes/problems_tags/problem_patterns rows.
  await pool.query('DELETE FROM problems WHERE id = ?', [problemId]);
  await pool.query('DELETE FROM patterns WHERE name = ?', [TEST_PATTERN_NAME]);
  await pool.end();
});

describe('notes API', () => {
  it('creates a review note with confidence 1 and computes a 3-day interval', async () => {
    const res = await request(app)
      .post(`/api/problems/${problemId}/notes`)
      .send({ type: 'review', content: 'struggled', confidence_score: 1 });

    expect(res.status).toBe(201);
    expect(res.body.intervalDays).toBe(3);
  });

  it('doubles the interval on a second Mastered review', async () => {
    const first = await request(app)
      .post(`/api/problems/${problemId}/notes`)
      .send({ type: 'review', content: 'nailed it', confidence_score: 3 });
    expect(first.body.intervalDays).toBe(30);

    const second = await request(app)
      .post(`/api/problems/${problemId}/notes`)
      .send({ type: 'review', content: 'still solid', confidence_score: 3 });
    expect(second.body.intervalDays).toBe(60);
  });

  it('rejects an out-of-range confidence score', async () => {
    const res = await request(app)
      .post(`/api/problems/${problemId}/notes`)
      .send({ type: 'review', content: 'x', confidence_score: 5 });

    expect(res.status).toBe(400);
  });

  it('lists notes for a problem, newest first', async () => {
    const res = await request(app).get(`/api/problems/${problemId}/notes`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
    expect(new Date(res.body[0].created_at).getTime()).toBeGreaterThanOrEqual(
      new Date(res.body[res.body.length - 1].created_at).getTime()
    );
  });
});

describe('patterns API', () => {
  it('attaches a pattern to a problem and reflects it on the problem detail response', async () => {
    const addRes = await request(app)
      .post(`/api/problems/${problemId}/patterns`)
      .send({ name: TEST_PATTERN_NAME });
    expect(addRes.status).toBe(201);

    const getRes = await request(app).get(`/api/problems/${problemId}`);
    expect(getRes.body.patterns.map((p: { name: string }) => p.name)).toContain(
      TEST_PATTERN_NAME
    );
  });

  it('detaches a pattern from a problem', async () => {
    const getRes = await request(app).get(`/api/problems/${problemId}`);
    const patternId = getRes.body.patterns.find(
      (p: { name: string }) => p.name === TEST_PATTERN_NAME
    ).id;

    const delRes = await request(app).delete(
      `/api/problems/${problemId}/patterns/${patternId}`
    );
    expect(delRes.status).toBe(204);

    const afterRes = await request(app).get(`/api/problems/${problemId}`);
    expect(afterRes.body.patterns).toHaveLength(0);
  });
});

describe('revision API', () => {
  it('flags a problem as overdue once it exceeds its interval, and clears after a fresh review', async () => {
    await pool.query(
      `INSERT INTO problems (title, leetcode_slug, difficulty, first_solved_date)
       VALUES (?, ?, 'Medium', DATE_SUB(CURDATE(), INTERVAL 100 DAY))`,
      ['Vitest Overdue Problem', `${TEST_SLUG}-overdue`]
    );
    const [rows] = await pool.query<import('mysql2').RowDataPacket[]>(
      'SELECT id FROM problems WHERE leetcode_slug = ?',
      [`${TEST_SLUG}-overdue`]
    );
    const overdueId = rows[0].id as number;

    const dueRes = await request(app).get('/api/revision/due');
    expect(dueRes.body.map((p: { id: number }) => p.id)).toContain(overdueId);

    await request(app)
      .post(`/api/problems/${overdueId}/notes`)
      .send({ type: 'review', content: 'reviewed just now', confidence_score: 2 });

    const dueAfterRes = await request(app).get('/api/revision/due');
    expect(dueAfterRes.body.map((p: { id: number }) => p.id)).not.toContain(overdueId);

    await pool.query('DELETE FROM problems WHERE id = ?', [overdueId]);
  });
});
