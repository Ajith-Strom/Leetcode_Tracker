export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type NoteType = 'approach' | 'review';

export interface Pattern {
  id: number;
  name: string;
}

export interface Problem {
  id: number;
  title: string;
  leetcode_slug: string;
  difficulty: Difficulty;
  first_solved_date: string;
  tags: string[];
  patterns?: Pattern[];
  content?: string | null;
  is_paid_only?: boolean;
}

export interface Note {
  id: number;
  problem_id: number;
  type: NoteType;
  confidence_score: number | null;
  interval_days: number | null;
  content: string;
  created_at: string;
}

export interface TagStat {
  name: string;
  count: number;
}

export interface DueProblem {
  id: number;
  title: string;
  leetcode_slug: string;
  difficulty: Difficulty;
  tags: string[];
  last_revised: string;
  interval_days: number;
  next_due_date: string;
  days_since: number;
  is_overridden: boolean;
  content: string | null;
  is_paid_only: boolean;
}

export interface ScheduledProblem {
  id: number;
  title: string;
  leetcode_slug: string;
  difficulty: Difficulty;
  tags: string[];
  last_revised: string;
  interval_days: number;
  next_due_date: string;
  days_until_due: number;
  is_overridden: boolean;
}

export interface Settings {
  revision_interval_days: number;
}

export interface PlaybookNote {
  content: string;
  confidence_score: number | null;
  created_at: string;
}

export interface PlaybookProblem {
  id: number;
  title: string;
  leetcode_slug: string;
  difficulty: Difficulty;
  notes: PlaybookNote[];
}

export interface PlaybookTopic {
  topic: string;
  problems: PlaybookProblem[];
}

export interface DayActivity {
  date: string;
  count: number;
}

export interface StreakStats {
  activity: DayActivity[];
  currentStreak: number;
  longestStreak: number;
}

export interface ConfidenceStat {
  confidence: number;
  label: string;
  count: number;
}

export interface DifficultyProgressionPoint {
  month: string;
  Easy: number;
  Medium: number;
  Hard: number;
}
