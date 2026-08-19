import Link from 'next/link';
import { getProblems, getDueProblems, getStreakStats, getTagStats } from '@/lib/api';
import SyncButton from '@/components/SyncButton';
import PageHeader from '@/components/PageHeader';
import StatTile from '@/components/StatTile';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import ProblemTable from '@/components/ProblemTable';
import TagPill from '@/components/TagPill';

export default async function DashboardPage() {
  const [problems, dueProblems, streakStats, tagStats] = await Promise.all([
    getProblems(),
    getDueProblems(),
    getStreakStats(30),
    getTagStats(),
  ]);

  const weakestTags = [...tagStats].sort((a, b) => a.count - b.count).slice(0, 5);
  const recentProblems = problems.slice(0, 5);

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        title="Dashboard"
        description="ajith_y's DSA progress at a glance"
        action={<SyncButton />}
      />

      <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
        <StatTile label="Total Solved" value={problems.length} href="/problems" />
        <StatTile
          label="Due for Revision"
          value={dueProblems.length}
          href="/revision"
        />
        <StatTile
          label="Current Streak"
          value={streakStats.currentStreak}
          unit="days"
          href="/stats"
        />
        <StatTile
          label="Longest Streak"
          value={streakStats.longestStreak}
          unit="days"
          href="/stats"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-10 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text">Recent Activity</h2>
            <Link href="/stats" className="text-xs text-accent hover:text-accent-hover">
              View all →
            </Link>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            {streakStats.activity.some((d) => d.count > 0) ? (
              <ActivityHeatmap activity={streakStats.activity} />
            ) : (
              <p className="text-sm text-text-muted">No solves in the last 30 days.</p>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text">Weakest Topics</h2>
            <Link href="/stats" className="text-xs text-accent hover:text-accent-hover">
              View all →
            </Link>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            {weakestTags.length === 0 ? (
              <p className="text-sm text-text-muted">No data yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {weakestTags.map((t) => (
                  <TagPill key={t.name} tag={`${t.name} (${t.count})`} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Recently Solved</h2>
          <Link href="/problems" className="text-xs text-accent hover:text-accent-hover">
            View all →
          </Link>
        </div>
        <ProblemTable problems={recentProblems} />
      </section>
    </main>
  );
}
