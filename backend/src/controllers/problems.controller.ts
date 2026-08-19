import { Request, Response } from 'express';
import { getAllProblems, getProblemById } from '../services/problems.repo';

export async function listProblems(_req: Request, res: Response) {
  const problems = await getAllProblems();
  res.json(problems);
}

export async function getProblem(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid problem id' });
    return;
  }
  const problem = await getProblemById(id);
  if (!problem) {
    res.status(404).json({ error: 'Problem not found' });
    return;
  }
  res.json(problem);
}
