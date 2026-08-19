import { Router } from 'express';
import { getTagStats } from '../controllers/stats.controller';

export const statsRouter = Router();
statsRouter.get('/stats/tags', getTagStats);
