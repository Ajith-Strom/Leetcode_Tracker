import { getProblem, getNotes } from '@/lib/api';
import NoteForm from '@/components/NoteForm';
import NoteList from '@/components/NoteList';

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
    <main>
      <h1>{problem.title}</h1>
      <p>
        {problem.difficulty} — {problem.tags.join(', ')}
      </p>
      <p>First solved: {problem.first_solved_date}</p>
      <a
        href={`https://leetcode.com/problems/${problem.leetcode_slug}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on LeetCode
      </a>

      <h2>Notes</h2>
      <NoteForm problemId={problemId} />
      <NoteList notes={notes} />
    </main>
  );
}
