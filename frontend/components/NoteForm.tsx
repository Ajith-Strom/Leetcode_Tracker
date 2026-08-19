'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNote } from '@/lib/api';
import { NoteType } from '@/lib/types';

const CONFIDENCE_OPTIONS: { value: 1 | 2 | 3; label: string }[] = [
  { value: 1, label: 'Struggled' },
  { value: 2, label: 'Satisfactory' },
  { value: 3, label: 'Mastered' },
];

export default function NoteForm({ problemId }: { problemId: number }) {
  const router = useRouter();
  const [type, setType] = useState<NoteType>('approach');
  const [content, setContent] = useState('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | null>(null);
  const [saving, setSaving] = useState(false);

  const needsConfidence = type === 'review';
  const canSubmit = content.trim() && (!needsConfidence || confidence !== null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await createNote(problemId, type, content, confidence ?? undefined);
      setContent('');
      setConfidence(null);
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

      {needsConfidence && (
        <div className="mb-3">
          <p className="text-xs text-text-muted mb-1.5">
            Confidence (drives when you&apos;ll see this again)
          </p>
          <div className="flex gap-1">
            {CONFIDENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setConfidence(opt.value)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  confidence === opt.value
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border text-text-muted hover:border-accent hover:text-text'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
          disabled={saving || !canSubmit}
          className="rounded-md bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Note'}
        </button>
      </div>
    </form>
  );
}
