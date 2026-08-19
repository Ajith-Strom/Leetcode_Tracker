import Link from 'next/link';
import { getProblem, getNotes, getAllPatterns } from '@/lib/api';
import NoteForm from '@/components/NoteForm';
import NoteList from '@/components/NoteList';
import DifficultyBadge from '@/components/DifficultyBadge';
import TagPill from '@/components/TagPill';
import PatternManager from '@/components/PatternManager';
import { formatDate } from '@/lib/format';

export default async function ProblemDetailPage({
  params,
}: PageProps<'/problems/[id]'>) {
  const { id } = await params;
  const problemId = Number(id);

  const [problem, notes, allPatterns] = await Promise.all([
    getProblem(problemId),
    getNotes(problemId),
    getAllPatterns(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <Link href="/problems" className="text-sm text-text-muted hover:text-text">
        ← Problems
      </Link>

      <div className="mt-4 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-text mb-1">{problem.title}</h1>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <span>
            Solved {formatDate(problem.first_solved_date)}
          </span>
          <span>·</span>
          <a
            href={`https://leetcode.com/problems/${problem.leetcode_slug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover"
          >
            View on LeetCode ↗
          </a>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-text mb-3">Patterns</h2>
      <div className="mb-8">
        <PatternManager
          problemId={problemId}
          patterns={problem.patterns ?? []}
          suggestions={allPatterns}
        />
      </div>

      <h2 className="text-sm font-semibold text-text mb-3">Notes</h2>
      <div className="mb-6">
        <NoteForm problemId={problemId} />
      </div>
      <NoteList notes={notes} />
    </main>
  );
}
