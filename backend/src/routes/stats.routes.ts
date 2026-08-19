import { Router } from 'express';
import { getTagStats, getStreakStats } from '../controllers/stats.controller';

export const statsRouter = Router();
statsRouter.get('/stats/tags', getTagStats);
statsRouter.get('/stats/streak', getStreakStats);
