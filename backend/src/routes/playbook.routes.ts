import { Router } from 'express';
import { getPlaybookHandler } from '../controllers/playbook.controller';

export const playbookRouter = Router();
playbookRouter.get('/playbook', getPlaybookHandler);
