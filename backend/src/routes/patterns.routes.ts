import { Router } from 'express';
import {
  listPatterns,
  addPatternToProblem,
  removePatternFromProblem,
} from '../controllers/patterns.controller';

export const patternsRouter = Router();
patternsRouter.get('/patterns', listPatterns);
patternsRouter.post('/problems/:id/patterns', addPatternToProblem);
patternsRouter.delete('/problems/:id/patterns/:patternId', removePatternFromProblem);
