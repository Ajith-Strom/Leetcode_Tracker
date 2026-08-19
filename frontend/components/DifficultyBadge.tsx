import { Difficulty } from '@/lib/types';

const styles: Record<Difficulty, string> = {
  Easy: 'bg-easy/15 text-easy',
  Medium: 'bg-medium/15 text-medium',
  Hard: 'bg-hard/15 text-hard',
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
