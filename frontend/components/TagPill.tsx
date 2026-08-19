export default function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-2 py-0.5 text-xs text-text-muted">
      {tag}
    </span>
  );
}
