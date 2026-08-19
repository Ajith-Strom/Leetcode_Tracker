export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type NoteType = 'approach' | 'review';

export interface Problem {
  id: number;
  title: string;
  leetcode_slug: string;
  difficulty: Difficulty;
  first_solved_date: string;
  tags: string[];
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
  days_since: number;
}

export interface Settings {
  revision_interval_days: number;
}
