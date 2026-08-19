import {
  getTagStats,
  getStreakStats,
  getConfidenceStats,
  getDifficultyProgression,
} from '@/lib/api';
import TagBarChart from '@/components/TagBarChart';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import StreakStatTiles from '@/components/StreakStatTiles';
import ConfidenceDonutChart from '@/components/ConfidenceDonutChart';
import DifficultyProgressionChart from '@/components/DifficultyProgressionChart';
import PageHeader from '@/components/PageHeader';

export default async function StatsPage() {
  const [tagStats, streakStats, confidenceStats, difficultyProgression] = await Promise.all([
    getTagStats(),
    getStreakStats(),
    getConfidenceStats(),
    getDifficultyProgression(),
  ]);

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
        description="Solving activity, progress, and weak areas"
      />

      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Activity</h2>
          <StreakStatTiles
            currentStreak={streakStats.currentStreak}
            longestStreak={streakStats.longestStreak}
          />
        </div>
        <div className="glass-panel p-4">
          <ActivityHeatmap activity={visibleActivity} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 mb-10 lg:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold text-text mb-3">Difficulty Progression</h2>
          {difficultyProgression.length === 0 ? (
            <div className="glass-panel border-dashed p-10 text-center">
              <p className="text-sm text-text-muted">No data yet.</p>
            </div>
          ) : (
            <div className="glass-panel p-4">
              <DifficultyProgressionChart data={difficultyProgression} />
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-semibold text-text mb-3">Review Confidence</h2>
          {confidenceStats.length === 0 ? (
            <div className="glass-panel border-dashed p-10 text-center">
              <p className="text-sm text-text-muted">
                No confidence-rated reviews yet.
              </p>
            </div>
          ) : (
            <div className="glass-panel p-4">
              <ConfidenceDonutChart data={confidenceStats} />
            </div>
          )}
        </section>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-text mb-3">Weak Areas</h2>
        {tagStats.length === 0 ? (
          <div className="glass-panel border-dashed p-10 text-center">
            <p className="text-sm text-text-muted">No data yet. Sync some problems first.</p>
          </div>
        ) : (
          <div className="glass-panel p-4">
            <TagBarChart data={tagStats} />
          </div>
        )}
      </section>
    </main>
  );
}
