import { Note } from '@/lib/types';

export default function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <p>No notes yet.</p>;
  }

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          <strong>[{note.type}]</strong> {note.content}
          <br />
          <small>{note.created_at}</small>
        </li>
      ))}
    </ul>
  );
}
