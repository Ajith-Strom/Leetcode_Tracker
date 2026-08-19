'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNote } from '@/lib/api';
import { NoteType } from '@/lib/types';

export default function NoteForm({ problemId }: { problemId: number }) {
  const router = useRouter();
  const [type, setType] = useState<NoteType>('approach');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try {
      await createNote(problemId, type, content);
      setContent('');
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value as NoteType)}>
        <option value="approach">Approach</option>
        <option value="review">Review</option>
      </select>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your notes..."
        rows={4}
      />
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Add Note'}
      </button>
    </form>
  );
}
