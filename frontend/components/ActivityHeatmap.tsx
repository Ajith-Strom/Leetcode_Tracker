import { DayActivity } from '@/lib/types';
import { groupActivityIntoWeeks, getIntensityLevel, getMonthLabels } from '@/lib/heatmap';
import { formatDate } from '@/lib/format';

const INTENSITY_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-white/5',
  1: 'bg-accent/25',
  2: 'bg-accent/50',
  3: 'bg-accent/75',
  4: 'bg-accent',
};

export default function ActivityHeatmap({ activity }: { activity: DayActivity[] }) {
  const weeks = groupActivityIntoWeeks(activity);
  const monthLabels = getMonthLabels(weeks);
  const maxCount = Math.max(...activity.map((d) => d.count), 1);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 h-3 mb-1.5">
        {monthLabels.map((label, weekIdx) => (
          <div key={weekIdx} className="relative w-3 h-3 shrink-0">
            {label && (
              <span className="absolute top-0 left-0 leading-3 whitespace-nowrap text-[9px] font-medium tracking-tight text-text-muted">
                {label}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) =>
              day ? (
                <div
                  key={dayIdx}
                  title={`${day.count} solved on ${formatDate(day.date)}`}
                  className={`h-3 w-3 rounded-sm border border-white/10 ${INTENSITY_CLASSES[getIntensityLevel(day.count, maxCount)]}`}
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
