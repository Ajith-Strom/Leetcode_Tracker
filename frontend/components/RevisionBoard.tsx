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
            className={`relative h-5 w-9 rounded-full transition-colors ${
              blind ? 'bg-accent' : 'border border-border bg-surface-hover'
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                blind ? 'translate-x-4' : 'translate-x-0.5'
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
