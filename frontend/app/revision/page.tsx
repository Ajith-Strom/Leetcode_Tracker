import { getDueProblems, getSettings } from '@/lib/api';
import RevisionList from '@/components/RevisionList';
import RevisionIntervalForm from '@/components/RevisionIntervalForm';
import PageHeader from '@/components/PageHeader';

export default async function RevisionPage() {
  const [dueProblems, settings] = await Promise.all([getDueProblems(), getSettings()]);

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        title="Due for Revision"
        description={`${dueProblems.length} problem${dueProblems.length === 1 ? '' : 's'} overdue`}
        action={<RevisionIntervalForm currentDays={settings.revision_interval_days} />}
      />
      <RevisionList problems={dueProblems} />
    </main>
  );
}
