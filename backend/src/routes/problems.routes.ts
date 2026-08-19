import { Router } from 'express';
import { listProblems, getProblem } from '../controllers/problems.controller';

export const problemsRouter = Router();
problemsRouter.get('/problems', listProblems);
problemsRouter.get('/problems/:id', getProblem);
