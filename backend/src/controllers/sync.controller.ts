import { Request, Response } from 'express';
import { runSync } from '../services/ingestion.service';
import { env } from '../config/env';

export async function postSync(_req: Request, res: Response) {
  try {
    const result = await runSync(env.leetcodeUsername);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sync failed' });
  }
}
