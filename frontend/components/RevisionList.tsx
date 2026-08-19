import Link from 'next/link';
import { DueProblem } from '@/lib/types';
import DifficultyBadge from '@/components/DifficultyBadge';

export default function RevisionList({ problems }: { problems: DueProblem[] }) {
  if (problems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-text-muted">Nothing overdue. Nice.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface text-left text-xs text-text-muted">
            <th className="px-4 py-2.5 font-medium">Title</th>
            <th className="px-4 py-2.5 font-medium">Difficulty</th>
            <th className="px-4 py-2.5 font-medium">Last Revised</th>
            <th className="px-4 py-2.5 font-medium">Days Overdue</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr
              key={p.id}
              className="border-b border-border last:border-0 hover:bg-surface-hover"
            >
              <td className="px-4 py-2.5">
                <Link
                  href={`/problems/${p.id}`}
                  className="font-medium text-text hover:text-accent"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-2.5">
                <DifficultyBadge difficulty={p.difficulty} />
              </td>
              <td className="px-4 py-2.5 text-text-muted whitespace-nowrap">
                {new Date(p.last_revised).toLocaleDateString()}
              </td>
              <td className="px-4 py-2.5">
                <span className="inline-flex items-center rounded-full bg-hard/15 px-2 py-0.5 text-xs font-medium text-hard">
                  {p.days_since}d
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
