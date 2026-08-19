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
      className={`glass-panel px-4 py-3 h-full transition-all ${
        href ? 'hover:border-accent/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]' : ''
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
