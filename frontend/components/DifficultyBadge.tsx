import { Difficulty } from '@/lib/types';

const styles: Record<Difficulty, string> = {
  Easy: 'bg-easy/10 text-easy border border-easy/25',
  Medium: 'bg-medium/10 text-medium border border-medium/25',
  Hard: 'bg-hard/10 text-hard border border-hard/25',
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
