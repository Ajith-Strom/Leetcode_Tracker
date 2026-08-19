import { DueProblem } from '@/lib/types';
import BlindRevisionRow from '@/components/BlindRevisionRow';

export default function BlindRevisionList({ problems }: { problems: DueProblem[] }) {
  if (problems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-text-muted">Nothing overdue. Nice.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {problems.map((p) => (
        <BlindRevisionRow key={p.id} problem={p} />
      ))}
    </div>
  );
}
