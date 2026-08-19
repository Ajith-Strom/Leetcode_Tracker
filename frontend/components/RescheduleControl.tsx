'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { rescheduleProblem, clearReschedule } from '@/lib/api';

export default function RescheduleControl({
  problemId,
  nextDueDate,
  isOverridden,
}: {
  problemId: number;
  nextDueDate: string;
  isOverridden: boolean;
}) {
  const router = useRouter();
  const [date, setDate] = useState(nextDueDate.slice(0, 10));
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!date) return;
    setSaving(true);
    try {
      await rescheduleProblem(problemId, date);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    setSaving(true);
    try {
      await clearReschedule(problemId);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded-md border border-white/10 bg-black/20 px-1.5 py-1 text-xs text-text focus:border-accent focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        title="Reschedule"
        className="rounded-md border border-white/10 px-1.5 py-1 text-xs text-text-muted transition-colors hover:border-accent hover:text-text disabled:opacity-50"
      >
        Save
      </button>
      {isOverridden && (
        <button
          type="button"
          onClick={handleClear}
          disabled={saving}
          title="Clear manual reschedule"
          className="text-xs text-text-muted hover:text-hard disabled:opacity-50"
        >
          ×
        </button>
      )}
    </div>
  );
}
