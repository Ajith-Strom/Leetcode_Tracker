import { Request, Response } from 'express';
import {
  getAllPatterns,
  upsertPattern,
  attachPatternToProblem,
  detachPatternFromProblem,
} from '../services/patterns.repo';

export async function listPatterns(_req: Request, res: Response) {
  const patterns = await getAllPatterns();
  res.json(patterns);
}

export async function addPatternToProblem(req: Request, res: Response) {
  const problemId = Number(req.params.id);
  const { name } = req.body as { name?: string };

  if (Number.isNaN(problemId) || !name?.trim()) {
    res.status(400).json({ error: 'Invalid pattern payload' });
    return;
  }

  const patternId = await upsertPattern(name.trim());
  await attachPatternToProblem(problemId, patternId);
  res.status(201).json({ id: patternId, name: name.trim() });
}

export async function removePatternFromProblem(req: Request, res: Response) {
  const problemId = Number(req.params.id);
  const patternId = Number(req.params.patternId);

  if (Number.isNaN(problemId) || Number.isNaN(patternId)) {
    res.status(400).json({ error: 'Invalid ids' });
    return;
  }

  await detachPatternFromProblem(problemId, patternId);
  res.status(204).send();
}
