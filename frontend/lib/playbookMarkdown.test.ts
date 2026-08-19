import { describe, it, expect } from 'vitest';
import { generatePlaybookMarkdown } from './playbookMarkdown';
import { PlaybookTopic } from './types';

const sample: PlaybookTopic[] = [
  {
    topic: 'Two Pointers',
    problems: [
      {
        id: 1,
        title: '3Sum',
        leetcode_slug: '3sum',
        difficulty: 'Medium',
        notes: [
          {
            content: 'Sort, fix one, two pointers for the rest.',
            confidence_score: 2,
            created_at: '2026-08-15T00:00:00.000Z',
          },
        ],
      },
    ],
  },
];

describe('generatePlaybookMarkdown', () => {
  it('starts with the top-level heading', () => {
    expect(generatePlaybookMarkdown(sample).startsWith('# DSA Playbook')).toBe(true);
  });

  it('renders topic and problem headings with the LeetCode link', () => {
    const md = generatePlaybookMarkdown(sample);
    expect(md).toContain('## Two Pointers');
    expect(md).toContain('### 3Sum (Medium)');
    expect(md).toContain('https://leetcode.com/problems/3sum/');
  });

  it('includes note content and a confidence label when present', () => {
    const md = generatePlaybookMarkdown(sample);
    expect(md).toContain('Satisfactory');
    expect(md).toContain('Sort, fix one, two pointers for the rest.');
  });

  it('omits the confidence suffix when a note has no confidence score', () => {
    const noConfidence: PlaybookTopic[] = [
      {
        topic: 'Array',
        problems: [
          {
            id: 2,
            title: 'Two Sum',
            leetcode_slug: 'two-sum',
            difficulty: 'Easy',
            notes: [
              { content: 'plain note', confidence_score: null, created_at: '2026-08-01T00:00:00.000Z' },
            ],
          },
        ],
      },
    ];
    const md = generatePlaybookMarkdown(noConfidence);
    expect(md).toMatch(/\*\*[^*]+\*\*: plain note/);
    expect(md).not.toContain('Struggled');
    expect(md).not.toContain('Mastered');
  });

  it('duplicates a problem under each topic it belongs to', () => {
    const multiTopic: PlaybookTopic[] = [
      {
        topic: 'Stack',
        problems: [
          { id: 3, title: 'X', leetcode_slug: 'x', difficulty: 'Easy', notes: [] },
        ],
      },
      {
        topic: 'String',
        problems: [
          { id: 3, title: 'X', leetcode_slug: 'x', difficulty: 'Easy', notes: [] },
        ],
      },
    ];
    const md = generatePlaybookMarkdown(multiTopic);
    expect(md.match(/### X \(Easy\)/g)).toHaveLength(2);
  });

  it('returns just the heading for an empty topic list', () => {
    expect(generatePlaybookMarkdown([])).toBe('# DSA Playbook\n');
  });
});
