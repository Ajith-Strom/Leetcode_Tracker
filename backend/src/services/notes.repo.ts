import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';
import { Note, NoteType } from '../types';

export async function createNote(params: {
  problemId: number;
  type: NoteType;
  content: string;
  confidenceScore?: number | null;
  intervalDays?: number | null;
}): Promise<number> {
  const { problemId, type, content, confidenceScore, intervalDays } = params;
  const [result] = await pool.query(
    'INSERT INTO notes (problem_id, type, confidence_score, interval_days, content) VALUES (?, ?, ?, ?, ?)',
    [problemId, type, confidenceScore ?? null, intervalDays ?? null, content]
  );
  return (result as { insertId: number }).insertId;
}

export async function getNotesForProblem(problemId: number): Promise<Note[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM notes WHERE problem_id = ? ORDER BY created_at DESC',
    [problemId]
  );
  return rows as Note[];
}

export async function getLatestReviewIntervalDays(problemId: number): Promise<number | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT interval_days FROM notes
     WHERE problem_id = ? AND type = 'review'
     ORDER BY created_at DESC LIMIT 1`,
    [problemId]
  );
  return rows.length > 0 ? (rows[0].interval_days as number | null) : null;
}
