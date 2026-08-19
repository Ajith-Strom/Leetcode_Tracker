'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DueProblem } from '@/lib/types';
import { createNote } from '@/lib/api';
import DifficultyBadge from '@/components/DifficultyBadge';
import TagPill from '@/components/TagPill';

export default function BlindRevisionRow({ problem }: { problem: DueProblem }) {
  const [revealed, setRevealed] = useState(false);
  const [attempting, setAttempting] = useState(false);
  const [approach, setApproach] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmitApproach(e: React.FormEvent) {
    e.preventDefault();
    if (!approach.trim()) return;
    setSaving(true);
    try {
      await createNote(problem.id, 'approach', approach);
      setRevealed(true);
      setAttempting(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-4">
        <a
          href={`https://leetcode.com/problems/${problem.leetcode_slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text hover:text-accent"
        >
          {problem.title} ↗
        </a>
        <div className="flex items-center gap-2 shrink-0">
          {!revealed && (
            <button
              type="button"
              onClick={() => setAttempting((a) => !a)}
              className="rounded-md border border-border px-2.5 py-1 text-xs text-text-muted transition-colors hover:border-accent hover:text-text"
            >
              Attempt
            </button>
          )}
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-text-muted transition-colors hover:border-accent hover:text-text"
          >
            {revealed ? 'Hide' : 'Reveal'}
          </button>
        </div>
      </div>

      {attempting && !revealed && (
        <form onSubmit={handleSubmitApproach} className="mt-3">
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            placeholder="Write your approach before revealing tags/difficulty..."
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving || !approach.trim()}
              className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Submit & Reveal'}
            </button>
          </div>
        </form>
      )}

      {revealed && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          <span className="ml-auto text-xs text-text-muted">
            {problem.days_since}d overdue ·{' '}
            <Link href={`/problems/${problem.id}`} className="text-accent hover:text-accent-hover">
              Full history
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
