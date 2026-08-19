export default function StreakStatTiles({
  currentStreak,
  longestStreak,
}: {
  currentStreak: number;
  longestStreak: number;
}) {
  return (
    <div className="flex gap-3">
      <div className="glass-panel px-4 py-2.5">
        <p className="text-xs text-text-muted">Current streak</p>
        <p className="text-lg font-semibold text-text">
          {currentStreak} <span className="text-sm font-normal text-text-muted">days</span>
        </p>
      </div>
      <div className="glass-panel px-4 py-2.5">
        <p className="text-xs text-text-muted">Longest streak</p>
        <p className="text-lg font-semibold text-text">
          {longestStreak} <span className="text-sm font-normal text-text-muted">days</span>
        </p>
      </div>
    </div>
  );
}
