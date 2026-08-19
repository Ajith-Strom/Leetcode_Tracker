import Link from 'next/link';
import { getProblem, getNotes } from '@/lib/api';
import NoteForm from '@/components/NoteForm';
import NoteList from '@/components/NoteList';
import DifficultyBadge from '@/components/DifficultyBadge';
import TagPill from '@/components/TagPill';

export default async function ProblemDetailPage({
  params,
}: PageProps<'/problems/[id]'>) {
  const { id } = await params;
  const problemId = Number(id);

  const [problem, notes] = await Promise.all([
    getProblem(problemId),
    getNotes(problemId),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <Link href="/" className="text-sm text-text-muted hover:text-text">
        ← Problems
      </Link>

      <div className="mt-4 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <h1 className="text-xl font-semibold text-text mb-1">{problem.title}</h1>
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <span>
            Solved {new Date(problem.first_solved_date).toLocaleDateString()}
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

      <h2 className="text-sm font-semibold text-text mb-3">Notes</h2>
      <div className="mb-6">
        <NoteForm problemId={problemId} />
      </div>
      <NoteList notes={notes} />
    </main>
  );
}
