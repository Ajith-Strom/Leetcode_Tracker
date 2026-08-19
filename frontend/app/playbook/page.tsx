import Link from 'next/link';
import { getPlaybook } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import DifficultyBadge from '@/components/DifficultyBadge';
import ExportPlaybookButton from '@/components/ExportPlaybookButton';
import { formatDate } from '@/lib/format';

const CONFIDENCE_LABELS: Record<number, string> = {
  1: 'Struggled',
  2: 'Shaky',
  3: 'Satisfactory',
  4: 'Mastered',
};

export default async function PlaybookPage() {
  const topics = await getPlaybook();

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <PageHeader
        title="Playbook"
        description="Review notes compiled by topic, ready to cram before an interview"
        action={<ExportPlaybookButton topics={topics} />}
      />

      {topics.length === 0 ? (
        <div className="glass-panel border-dashed p-10 text-center">
          <p className="text-sm text-text-muted">
            No review notes yet. Add a review note on a problem to start building your
            playbook.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {topics.map(({ topic, problems }) => (
            <section key={topic}>
              <h2 className="text-sm font-semibold text-accent mb-3">{topic}</h2>
              <div className="flex flex-col gap-4">
                {problems.map((problem) => (
                  <div
                    key={problem.id}
                    className="glass-panel glass-hover p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/problems/${problem.id}`}
                        className="font-medium text-text hover:text-accent"
                      >
                        {problem.title}
                      </Link>
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {problem.notes.map((note, i) => (
                        <li key={i} className="text-sm text-text-muted">
                          <span className="text-text">{note.content}</span>
                          {' — '}
                          {formatDate(note.created_at)}
                          {note.confidence_score && (
                            <> · {CONFIDENCE_LABELS[note.confidence_score]}</>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
