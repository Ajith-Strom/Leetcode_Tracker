import { getProblems } from '@/lib/api';
import ProblemTable from '@/components/ProblemTable';
import SyncButton from '@/components/SyncButton';

export default async function HomePage() {
  const problems = await getProblems();

  return (
    <main>
      <h1>DSA Progress Tracker</h1>
      <SyncButton />
      <ProblemTable problems={problems} />
    </main>
  );
}
