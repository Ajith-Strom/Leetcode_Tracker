import { PlaybookTopic } from './types';
import { formatDate } from './format';

const CONFIDENCE_LABELS: Record<number, string> = {
  1: 'Struggled',
  2: 'Shaky',
  3: 'Satisfactory',
  4: 'Mastered',
};

export function generatePlaybookMarkdown(topics: PlaybookTopic[]): string {
  const lines: string[] = ['# DSA Playbook', ''];

  for (const { topic, problems } of topics) {
    lines.push(`## ${topic}`, '');

    for (const problem of problems) {
      lines.push(
        `### ${problem.title} (${problem.difficulty})`,
        `https://leetcode.com/problems/${problem.leetcode_slug}/`,
        ''
      );

      for (const note of problem.notes) {
        const confidence = note.confidence_score
          ? ` — ${CONFIDENCE_LABELS[note.confidence_score]}`
          : '';
        lines.push(`- **${formatDate(note.created_at)}${confidence}**: ${note.content}`);
      }

      lines.push('');
    }
  }

  return lines.join('\n');
}
