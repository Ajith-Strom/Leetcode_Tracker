import { getTagStats } from '@/lib/api';
import TagBarChart from '@/components/TagBarChart';

export default async function StatsPage() {
  const tagStats = await getTagStats();

  return (
    <main>
      <h1>Topic-wise Weak Areas</h1>
      {tagStats.length === 0 ? (
        <p>No data yet. Sync some problems first.</p>
      ) : (
        <TagBarChart data={tagStats} />
      )}
    </main>
  );
}
