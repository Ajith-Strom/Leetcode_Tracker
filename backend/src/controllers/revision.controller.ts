import { Request, Response } from 'express';
import { getDueProblems, getRevisionSchedule } from '../services/revision.service';

export async function getDue(_req: Request, res: Response) {
  const due = await getDueProblems();
  res.json(due);
}

export async function getSchedule(_req: Request, res: Response) {
  const schedule = await getRevisionSchedule();
  res.json(schedule);
}
