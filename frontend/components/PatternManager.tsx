'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pattern } from '@/lib/types';
import { addPattern, removePattern } from '@/lib/api';

export default function PatternManager({
  problemId,
  patterns,
  suggestions,
}: {
  problemId: number;
  patterns: Pattern[];
  suggestions: Pattern[];
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await addPattern(problemId, name.trim());
      setName('');
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(patternId: number) {
    setRemovingId(patternId);
    try {
      await removePattern(problemId, patternId);
      router.refresh();
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {patterns.length === 0 && (
          <span className="text-sm text-text-muted">No patterns tagged yet.</span>
        )}
        {patterns.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent"
          >
            {p.name}
            <button
              type="button"
              onClick={() => handleRemove(p.id)}
              disabled={removingId === p.id}
              className="text-accent/70 hover:text-accent"
              aria-label={`Remove ${p.name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Fast & Slow Pointers"
          list="pattern-suggestions"
          className="flex-1 rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <datalist id="pattern-suggestions">
          {suggestions.map((s) => (
            <option key={s.id} value={s.name} />
          ))}
        </datalist>
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="rounded-md border border-border bg-surface-hover px-3 py-1.5 text-sm text-text transition-colors hover:border-accent disabled:opacity-50"
        >
          {saving ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
}
