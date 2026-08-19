import { Request, Response } from 'express';
import { setOverrideDueDate, clearOverrideDueDate } from '../services/problems.repo';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function putReschedule(req: Request, res: Response) {
  const problemId = Number(req.params.id);
  const { date } = req.body as { date?: string };

  if (Number.isNaN(problemId) || !date || !DATE_RE.test(date)) {
    res.status(400).json({ error: 'date must be provided as YYYY-MM-DD' });
    return;
  }

  await setOverrideDueDate(problemId, date);
  res.json({ id: problemId, override_due_date: date });
}

export async function deleteReschedule(req: Request, res: Response) {
  const problemId = Number(req.params.id);
  if (Number.isNaN(problemId)) {
    res.status(400).json({ error: 'Invalid problem id' });
    return;
  }

  await clearOverrideDueDate(problemId);
  res.status(204).send();
}
