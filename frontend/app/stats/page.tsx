import { getTagStats } from '@/lib/api';
import TagBarChart from '@/components/TagBarChart';
import PageHeader from '@/components/PageHeader';

export default async function StatsPage() {
  const tagStats = await getTagStats();

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <PageHeader
        title="Weak Areas"
        description="Solve counts grouped by topic tag"
      />
      {tagStats.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-sm text-text-muted">No data yet. Sync some problems first.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface p-4">
          <TagBarChart data={tagStats} />
        </div>
      )}
    </main>
  );
}
