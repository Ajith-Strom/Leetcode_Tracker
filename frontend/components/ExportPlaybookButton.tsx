'use client';

import { PlaybookTopic } from '@/lib/types';
import { generatePlaybookMarkdown } from '@/lib/playbookMarkdown';

export default function ExportPlaybookButton({ topics }: { topics: PlaybookTopic[] }) {
  function handleExport() {
    const markdown = generatePlaybookMarkdown(topics);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dsa-playbook.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      disabled={topics.length === 0}
      className="inline-flex items-center gap-2 rounded-md bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Export to Markdown
    </button>
  );
}
