import { Request, Response } from 'express';
import { getRevisionIntervalDays, setRevisionIntervalDays } from '../services/revision.service';

export async function getSettings(_req: Request, res: Response) {
  const revision_interval_days = await getRevisionIntervalDays();
  res.json({ revision_interval_days });
}

export async function putSettings(req: Request, res: Response) {
  const days = Number(req.body.revision_interval_days);
  if (!Number.isFinite(days) || days <= 0) {
    res.status(400).json({ error: 'revision_interval_days must be a positive number' });
    return;
  }
  await setRevisionIntervalDays(days);
  res.json({ revision_interval_days: days });
}
