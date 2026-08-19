'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Problems' },
  { href: '/stats', label: 'Weak Areas' },
  { href: '/revision', label: 'Revision' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface px-4 py-6 flex flex-col gap-6">
      <div className="px-2">
        <h1 className="text-sm font-semibold tracking-tight text-text">
          DSA Tracker
        </h1>
        <p className="text-xs text-text-muted mt-0.5">ajith_y</p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active =
            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                active
                  ? 'bg-accent/15 text-accent font-medium'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
