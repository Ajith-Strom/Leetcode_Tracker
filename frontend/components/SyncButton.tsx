'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { runSync } from '@/lib/api';

export default function SyncButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSync() {
    setLoading(true);
    setMessage(null);
    try {
      const result = await runSync();
      setMessage(`+${result.newProblems} new problem${result.newProblems === 1 ? '' : 's'}`);
      router.refresh();
    } catch (err) {
      setMessage('Sync failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {message && <span className="text-sm text-text-muted">{message}</span>}
      <button
        onClick={handleSync}
        disabled={loading}
        className="btn-primary disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Syncing
          </>
        ) : (
          'Sync'
        )}
      </button>
    </div>
  );
}
