import { Note } from '@/lib/types';
import { formatDateTime } from '@/lib/format';

const CONFIDENCE_LABELS: Record<number, string> = {
  1: 'Struggled',
  2: 'Satisfactory',
  3: 'Mastered',
};

export default function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-text-muted py-4">No notes yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {notes.map((note) => (
        <li
          key={note.id}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  note.type === 'approach'
                    ? 'bg-accent/15 text-accent'
                    : 'bg-easy/15 text-easy'
                }`}
              >
                {note.type}
              </span>
              {note.confidence_score && (
                <span className="text-xs text-text-muted">
                  {CONFIDENCE_LABELS[note.confidence_score]}
                  {note.interval_days && ` · next in ${note.interval_days}d`}
                </span>
              )}
            </div>
            <span className="text-xs text-text-muted">
              {formatDateTime(note.created_at)}
            </span>
          </div>
          <p className="text-sm text-text whitespace-pre-wrap">{note.content}</p>
        </li>
      ))}
    </ul>
  );
}
