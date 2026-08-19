import { Request, Response } from 'express';
import { createNote, getNotesForProblem } from '../services/notes.repo';
import { NoteType } from '../types';

export async function listNotes(req: Request, res: Response) {
  const problemId = Number(req.params.id);
  if (Number.isNaN(problemId)) {
    res.status(400).json({ error: 'Invalid problem id' });
    return;
  }
  const notes = await getNotesForProblem(problemId);
  res.json(notes);
}

export async function postNote(req: Request, res: Response) {
  const problemId = Number(req.params.id);
  const { type, content, confidence_score } = req.body as {
    type: NoteType;
    content: string;
    confidence_score?: number;
  };

  if (Number.isNaN(problemId) || (type !== 'approach' && type !== 'review') || !content) {
    res.status(400).json({ error: 'Invalid note payload' });
    return;
  }

  const id = await createNote({
    problemId,
    type,
    content,
    confidenceScore: confidence_score ?? null,
  });
  res.status(201).json({ id });
}
