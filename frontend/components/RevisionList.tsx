import Link from 'next/link';
import { DueProblem } from '@/lib/types';
import DifficultyBadge from '@/components/DifficultyBadge';
import TagPill from '@/components/TagPill';
import { formatDate } from '@/lib/format';

export default function RevisionList({ problems }: { problems: DueProblem[] }) {
  if (problems.length === 0) {
    return (
      <div className="glass-panel border-dashed p-10 text-center">
        <p className="text-sm text-text-muted">Nothing overdue. Nice.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] text-left text-xs text-text-muted">
            <th className="px-4 py-2.5 font-medium">Title</th>
            <th className="px-4 py-2.5 font-medium">Difficulty</th>
            <th className="px-4 py-2.5 font-medium">Tags</th>
            <th className="px-4 py-2.5 font-medium">Last Revised</th>
            <th className="px-4 py-2.5 font-medium">Interval</th>
            <th className="px-4 py-2.5 font-medium">Days Overdue</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr
              key={p.id}
              className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
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
              <td className="px-4 py-2.5">
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <TagPill key={tag} tag={tag} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-2.5 text-text-muted whitespace-nowrap">
                {formatDate(p.last_revised)}
              </td>
              <td className="px-4 py-2.5 text-text-muted whitespace-nowrap">
                every {p.interval_days}d
              </td>
              <td className="px-4 py-2.5">
                <span className="inline-flex items-center rounded-full border border-hard/25 bg-hard/10 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-hard">
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
