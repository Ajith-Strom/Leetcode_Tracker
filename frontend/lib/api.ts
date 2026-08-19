import {
  Problem,
  Note,
  TagStat,
  DueProblem,
  Settings,
  NoteType,
  Pattern,
  PlaybookTopic,
  StreakStats,
  ConfidenceStat,
  DifficultyProgressionPoint,
  ScheduledProblem,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${path} (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getProblems(): Promise<Problem[]> {
  return apiFetch<Problem[]>('/api/problems');
}

export function getProblem(id: number): Promise<Problem> {
  return apiFetch<Problem>(`/api/problems/${id}`);
}

export function getTagStats(): Promise<TagStat[]> {
  return apiFetch<TagStat[]>('/api/stats/tags');
}

export function getDueProblems(): Promise<DueProblem[]> {
  return apiFetch<DueProblem[]>('/api/revision/due');
}

export function getRevisionSchedule(): Promise<ScheduledProblem[]> {
  return apiFetch<ScheduledProblem[]>('/api/revision/schedule');
}

export function getSettings(): Promise<Settings> {
  return apiFetch<Settings>('/api/settings');
}

export function updateSettings(revisionIntervalDays: number): Promise<Settings> {
  return apiFetch<Settings>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify({ revision_interval_days: revisionIntervalDays }),
  });
}

export function getNotes(problemId: number): Promise<Note[]> {
  return apiFetch<Note[]>(`/api/problems/${problemId}/notes`);
}

export function createNote(
  problemId: number,
  type: NoteType,
  content: string,
  confidenceScore?: number
): Promise<{ id: number; intervalDays: number | null }> {
  return apiFetch<{ id: number; intervalDays: number | null }>(
    `/api/problems/${problemId}/notes`,
    {
      method: 'POST',
      body: JSON.stringify({ type, content, confidence_score: confidenceScore }),
    }
  );
}

export function runSync(): Promise<{ newProblems: number; totalFetched: number }> {
  return apiFetch<{ newProblems: number; totalFetched: number }>('/api/sync', {
    method: 'POST',
  });
}

export function getAllPatterns(): Promise<Pattern[]> {
  return apiFetch<Pattern[]>('/api/patterns');
}

export function addPattern(problemId: number, name: string): Promise<Pattern> {
  return apiFetch<Pattern>(`/api/problems/${problemId}/patterns`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function removePattern(problemId: number, patternId: number): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/api/problems/${problemId}/patterns/${patternId}`,
    { method: 'DELETE' }
  );
  if (!res.ok) {
    throw new Error(`Failed to remove pattern (${res.status})`);
  }
}

export function getPlaybook(): Promise<PlaybookTopic[]> {
  return apiFetch<PlaybookTopic[]>('/api/playbook');
}

export function getStreakStats(days = 365): Promise<StreakStats> {
  return apiFetch<StreakStats>(`/api/stats/streak?days=${days}`);
}

export function getConfidenceStats(): Promise<ConfidenceStat[]> {
  return apiFetch<ConfidenceStat[]>('/api/stats/confidence');
}

export function getDifficultyProgression(): Promise<DifficultyProgressionPoint[]> {
  return apiFetch<DifficultyProgressionPoint[]>('/api/stats/difficulty-progression');
}

export function rescheduleProblem(
  problemId: number,
  date: string
): Promise<{ id: number; override_due_date: string }> {
  return apiFetch<{ id: number; override_due_date: string }>(
    `/api/problems/${problemId}/reschedule`,
    {
      method: 'PUT',
      body: JSON.stringify({ date }),
    }
  );
}

export async function clearReschedule(problemId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/problems/${problemId}/reschedule`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to clear reschedule (${res.status})`);
  }
}
