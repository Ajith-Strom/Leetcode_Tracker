import { Request, Response } from 'express';
import { createNote, getNotesForProblem, getLatestReviewIntervalDays } from '../services/notes.repo';
import { computeNextIntervalDays, getRevisionIntervalDays } from '../services/revision.service';
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

  if (confidence_score !== undefined && ![1, 2, 3].includes(confidence_score)) {
    res.status(400).json({ error: 'confidence_score must be 1, 2, or 3' });
    return;
  }

  let intervalDays: number | null = null;
  if (type === 'review' && confidence_score) {
    const previousIntervalDays =
      (await getLatestReviewIntervalDays(problemId)) ?? (await getRevisionIntervalDays());
    intervalDays = computeNextIntervalDays(confidence_score, previousIntervalDays);
  }

  const id = await createNote({
    problemId,
    type,
    content,
    confidenceScore: confidence_score ?? null,
    intervalDays,
  });
  res.status(201).json({ id, intervalDays });
}
