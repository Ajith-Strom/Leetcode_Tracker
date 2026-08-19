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
        className="w-16 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-2 py-1 text-sm text-text focus:border-accent focus:outline-none"
      />
      <span className="text-sm text-text-muted">days</span>
      <button type="submit" disabled={saving} className="btn-secondary">
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
