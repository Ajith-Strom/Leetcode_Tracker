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
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4"
    >
      <div className="flex gap-1 mb-3">
        {(['approach', 'review'] as NoteType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
              type === t
                ? 'bg-accent/15 text-accent'
                : 'text-text-muted hover:bg-surface-hover'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          type === 'approach'
            ? 'How did you approach this problem?'
            : "What's worth remembering next time?"
        }
        rows={4}
        className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={saving || !content.trim()}
          className="rounded-md bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Note'}
        </button>
      </div>
    </form>
  );
}
