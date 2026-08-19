import DOMPurify from 'isomorphic-dompurify';

export default function QuestionContent({
  content,
  isPaidOnly,
  leetcodeSlug,
}: {
  content: string | null;
  isPaidOnly: boolean;
  leetcodeSlug: string;
}) {
  if (!content) {
    return (
      <p className="text-sm text-text-muted">
        {isPaidOnly
          ? 'This is a LeetCode Premium problem — the full text isn\'t available via the public API.'
          : 'Question text not available yet.'}{' '}
        <a
          href={`https://leetcode.com/problems/${leetcodeSlug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover"
        >
          View on LeetCode ↗
        </a>
      </p>
    );
  }

  const safeHtml = DOMPurify.sanitize(content);

  return (
    <div
      className="question-content text-sm text-text"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
