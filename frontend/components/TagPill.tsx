export default function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-hover px-2 py-0.5 text-xs text-text-muted">
      {tag}
    </span>
  );
}
