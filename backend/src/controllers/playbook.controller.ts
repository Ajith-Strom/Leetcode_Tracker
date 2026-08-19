import { Request, Response } from 'express';
import { getPlaybook } from '../services/playbook.service';

export async function getPlaybookHandler(_req: Request, res: Response) {
  const playbook = await getPlaybook();
  res.json(playbook);
}
