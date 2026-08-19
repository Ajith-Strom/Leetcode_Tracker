import { Request, Response } from 'express';
import { getDueProblems } from '../services/revision.service';

export async function getDue(_req: Request, res: Response) {
  const due = await getDueProblems();
  res.json(due);
}
