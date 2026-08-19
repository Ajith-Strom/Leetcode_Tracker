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
      setMessage(`Synced: ${result.newProblems} new problem(s) added.`);
      router.refresh();
    } catch (err) {
      setMessage('Sync failed. Check backend logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleSync} disabled={loading}>
        {loading ? 'Syncing...' : 'Sync'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
