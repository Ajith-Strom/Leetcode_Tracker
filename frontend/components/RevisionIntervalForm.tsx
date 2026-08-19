'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSettings } from '@/lib/api';

export default function RevisionIntervalForm({ currentDays }: { currentDays: number }) {
  const router = useRouter();
  const [days, setDays] = useState(currentDays);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(days);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label className="text-sm text-text-muted" htmlFor="interval">
        Default interval (unreviewed)
      </label>
      <input
        id="interval"
        type="number"
        min={1}
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
        className="w-16 rounded-md border border-border bg-surface px-2 py-1 text-sm text-text focus:border-accent focus:outline-none"
      />
      <span className="text-sm text-text-muted">days</span>
      <button
        type="submit"
        disabled={saving}
        className="rounded-md border border-border bg-surface-hover px-3 py-1 text-sm text-text transition-colors hover:border-accent disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
