export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type NoteType = 'approach' | 'review';

export interface AcSubmission {
  title: string;
  titleSlug: string;
  timestamp: string; // unix seconds, as string
}

export interface QuestionData {
  difficulty: Difficulty;
  topicTags: { name: string; slug: string }[];
}

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
