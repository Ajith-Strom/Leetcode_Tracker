import { Router } from 'express';
import { getDue, getSchedule } from '../controllers/revision.controller';
import { putReschedule, deleteReschedule } from '../controllers/reschedule.controller';

export const revisionRouter = Router();
revisionRouter.get('/revision/due', getDue);
revisionRouter.get('/revision/schedule', getSchedule);
revisionRouter.put('/problems/:id/reschedule', putReschedule);
revisionRouter.delete('/problems/:id/reschedule', deleteReschedule);
