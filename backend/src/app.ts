import express from 'express';
import cors from 'cors';
import { syncRouter } from './routes/sync.routes';
import { problemsRouter } from './routes/problems.routes';
import { statsRouter } from './routes/stats.routes';
import { revisionRouter } from './routes/revision.routes';
import { settingsRouter } from './routes/settings.routes';
import { notesRouter } from './routes/notes.routes';
import { patternsRouter } from './routes/patterns.routes';
import { playbookRouter } from './routes/playbook.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', syncRouter);
app.use('/api', problemsRouter);
app.use('/api', statsRouter);
app.use('/api', revisionRouter);
app.use('/api', settingsRouter);
app.use('/api', notesRouter);
app.use('/api', patternsRouter);
app.use('/api', playbookRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});
