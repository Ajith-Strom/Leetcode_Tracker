import { Router } from 'express';
import {
  getTagStats,
  getStreakStats,
  getConfidenceStats,
  getDifficultyProgression,
} from '../controllers/stats.controller';

export const statsRouter = Router();
statsRouter.get('/stats/tags', getTagStats);
statsRouter.get('/stats/streak', getStreakStats);
statsRouter.get('/stats/confidence', getConfidenceStats);
statsRouter.get('/stats/difficulty-progression', getDifficultyProgression);
