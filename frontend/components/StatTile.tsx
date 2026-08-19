import Link from 'next/link';

export default function StatTile({
  label,
  value,
  unit,
  href,
}: {
  label: string;
  value: string | number;
  unit?: string;
  href?: string;
}) {
  const inner = (
    <div
      className={`rounded-lg border border-border bg-surface px-4 py-3 h-full transition-colors ${
        href ? 'hover:border-accent' : ''
      }`}
    >
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-2xl font-semibold text-text mt-1">
        {value}
        {unit && <span className="text-sm font-normal text-text-muted ml-1">{unit}</span>}
      </p>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
