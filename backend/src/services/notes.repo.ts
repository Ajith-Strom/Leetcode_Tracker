import { RowDataPacket } from 'mysql2';
import { pool } from '../db/pool';
import { Note, NoteType } from '../types';

export async function createNote(params: {
  problemId: number;
  type: NoteType;
  content: string;
  confidenceScore?: number | null;
}): Promise<number> {
  const { problemId, type, content, confidenceScore } = params;
  const [result] = await pool.query(
    'INSERT INTO notes (problem_id, type, confidence_score, content) VALUES (?, ?, ?, ?)',
    [problemId, type, confidenceScore ?? null, content]
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
