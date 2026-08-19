import { getProblems } from '@/lib/api';
import ProblemTable from '@/components/ProblemTable';
import SyncButton from '@/components/SyncButton';
import PageHeader from '@/components/PageHeader';

export default async function HomePage() {
  const problems = await getProblems();

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        title="Problems"
        description={`${problems.length} solved`}
        action={<SyncButton />}
      />
      <ProblemTable problems={problems} />
    </main>
  );
}
