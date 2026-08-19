'use client';

import { useState } from 'react';
import { DueProblem } from '@/lib/types';
import RevisionList from '@/components/RevisionList';
import BlindRevisionList from '@/components/BlindRevisionList';

export default function RevisionBoard({ problems }: { problems: DueProblem[] }) {
  const [blind, setBlind] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-text-muted">
          <span>Blind Revision Mode</span>
          <button
            type="button"
            role="switch"
            aria-checked={blind}
            onClick={() => setBlind((b) => !b)}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border p-0 transition-colors ${
              blind
                ? 'border-transparent bg-accent shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <span
              className={`absolute top-px left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                blind ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>
      {blind ? (
        <BlindRevisionList problems={problems} />
      ) : (
        <RevisionList problems={problems} />
      )}
    </div>
  );
}
