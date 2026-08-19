import { DayActivity } from '@/lib/types';
import { groupActivityIntoWeeks, getIntensityLevel } from '@/lib/heatmap';
import { formatDate } from '@/lib/format';

const INTENSITY_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-surface-hover',
  1: 'bg-accent/25',
  2: 'bg-accent/50',
  3: 'bg-accent/75',
  4: 'bg-accent',
};

export default function ActivityHeatmap({ activity }: { activity: DayActivity[] }) {
  const weeks = groupActivityIntoWeeks(activity);
  const maxCount = Math.max(...activity.map((d) => d.count), 1);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) =>
              day ? (
                <div
                  key={dayIdx}
                  title={`${day.count} solved on ${formatDate(day.date)}`}
                  className={`h-3 w-3 rounded-sm border border-border/50 ${INTENSITY_CLASSES[getIntensityLevel(day.count, maxCount)]}`}
                />
              ) : (
                <div key={dayIdx} className="h-3 w-3" />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
