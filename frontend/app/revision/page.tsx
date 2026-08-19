import { getDueProblems, getRevisionSchedule, getSettings } from '@/lib/api';
import RevisionBoard from '@/components/RevisionBoard';
import RevisionIntervalForm from '@/components/RevisionIntervalForm';
import ScheduleList from '@/components/ScheduleList';
import PageHeader from '@/components/PageHeader';

export default async function RevisionPage() {
  const [dueProblems, schedule, settings] = await Promise.all([
    getDueProblems(),
    getRevisionSchedule(),
    getSettings(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        title="Due for Revision"
        description={`${dueProblems.length} problem${dueProblems.length === 1 ? '' : 's'} overdue`}
        action={<RevisionIntervalForm currentDays={settings.revision_interval_days} />}
      />
      <RevisionBoard problems={dueProblems} />

      <h2 className="text-sm font-semibold text-text mt-10 mb-3">Full Schedule</h2>
      <ScheduleList problems={schedule} />
    </main>
  );
}
