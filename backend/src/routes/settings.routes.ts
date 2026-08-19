import { Router } from 'express';
import { getSettings, putSettings } from '../controllers/settings.controller';

export const settingsRouter = Router();
settingsRouter.get('/settings', getSettings);
settingsRouter.put('/settings', putSettings);
