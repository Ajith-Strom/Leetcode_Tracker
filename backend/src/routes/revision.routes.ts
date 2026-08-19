import { Router } from 'express';
import { getDue } from '../controllers/revision.controller';

export const revisionRouter = Router();
revisionRouter.get('/revision/due', getDue);
