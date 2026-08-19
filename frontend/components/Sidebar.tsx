'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/problems', label: 'Problems' },
  { href: '/stats', label: 'Insights' },
  { href: '/revision', label: 'Revision' },
  { href: '/playbook', label: 'Playbook' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel-strong sticky top-0 h-screen w-56 shrink-0 rounded-none border-y-0 border-l-0 px-4 py-6 flex flex-col gap-6">
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
              className={`rounded-lg px-3 py-1.5 text-sm transition-all ${
                active
                  ? 'bg-accent/15 text-accent font-medium shadow-[0_0_16px_rgba(99,102,241,0.25)]'
                  : 'text-text-muted hover:bg-white/5 hover:text-text'
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
