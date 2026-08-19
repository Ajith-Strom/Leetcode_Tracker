import Link from 'next/link';
import { ScheduledProblem } from '@/lib/types';
import DifficultyBadge from '@/components/DifficultyBadge';
import TagPill from '@/components/TagPill';
import RescheduleControl from '@/components/RescheduleControl';
import { formatDate } from '@/lib/format';

function DueBadge({ daysUntilDue }: { daysUntilDue: number }) {
  if (daysUntilDue < 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-hard/25 bg-hard/10 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-hard">
        {Math.abs(daysUntilDue)}d overdue
      </span>
    );
  }
  if (daysUntilDue === 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-medium/25 bg-medium/10 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-medium">
        Due today
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-2 py-0.5 text-xs text-text-muted">
      in {daysUntilDue}d
    </span>
  );
}

export default function ScheduleList({ problems }: { problems: ScheduledProblem[] }) {
  if (problems.length === 0) {
    return (
      <div className="glass-panel border-dashed p-10 text-center">
        <p className="text-sm text-text-muted">No problems synced yet.</p>
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
            <th className="px-4 py-2.5 font-medium">Next Review</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Reschedule</th>
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
                {formatDate(p.next_due_date)}
                {p.is_overridden && (
                  <span
                    title="Manually rescheduled"
                    className="ml-1 text-accent"
                  >
                    •
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5">
                <DueBadge daysUntilDue={p.days_until_due} />
              </td>
              <td className="px-4 py-2.5">
                <RescheduleControl
                  problemId={p.id}
                  nextDueDate={p.next_due_date}
                  isOverridden={p.is_overridden}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
