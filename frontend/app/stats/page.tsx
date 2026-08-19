import { getTagStats, getStreakStats } from '@/lib/api';
import TagBarChart from '@/components/TagBarChart';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import StreakStatTiles from '@/components/StreakStatTiles';
import PageHeader from '@/components/PageHeader';

export default async function StatsPage() {
  const [tagStats, streakStats] = await Promise.all([getTagStats(), getStreakStats()]);

  // Trim the grid to start shortly before the earliest real activity, rather
  // than always rendering a full year, so a new account's data doesn't sit
  // marooned in the corner of a mostly-empty grid.
  const firstActiveIdx = streakStats.activity.findIndex((d) => d.count > 0);
  const visibleActivity =
    firstActiveIdx === -1
      ? streakStats.activity.slice(-30)
      : streakStats.activity.slice(Math.max(0, firstActiveIdx - 7));

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        title="Insights"
        description="Solving activity and weak areas"
      />

      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Activity</h2>
          <StreakStatTiles
            currentStreak={streakStats.currentStreak}
            longestStreak={streakStats.longestStreak}
          />
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <ActivityHeatmap activity={visibleActivity} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-text mb-3">Weak Areas</h2>
        {tagStats.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm text-text-muted">No data yet. Sync some problems first.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface p-4">
            <TagBarChart data={tagStats} />
          </div>
        )}
      </section>
    </main>
  );
}
