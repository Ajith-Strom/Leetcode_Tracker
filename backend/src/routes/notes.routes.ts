import { Router } from 'express';
import { listNotes, postNote } from '../controllers/notes.controller';

export const notesRouter = Router();
notesRouter.get('/problems/:id/notes', listNotes);
notesRouter.post('/problems/:id/notes', postNote);
