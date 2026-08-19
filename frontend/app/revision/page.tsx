import { getDueProblems, getSettings } from '@/lib/api';
import RevisionList from '@/components/RevisionList';
import RevisionIntervalForm from '@/components/RevisionIntervalForm';

export default async function RevisionPage() {
  const [dueProblems, settings] = await Promise.all([getDueProblems(), getSettings()]);

  return (
    <main>
      <h1>Due for Revision</h1>
      <RevisionIntervalForm currentDays={settings.revision_interval_days} />
      <RevisionList problems={dueProblems} />
    </main>
  );
}
