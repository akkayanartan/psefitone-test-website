import type { ReactNode } from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/lib/admin/auth';
import { LogoutButton } from './_components/LogoutButton';

export const metadata = {
  title: 'Psefitone Yönetim',
  robots: { index: false, follow: false },
};

const NAV_LINKS: Array<{ href: string; label: string; exact?: boolean }> = [
  { href: '/admin', label: 'Panel', exact: true },
  { href: '/admin/payments', label: 'Ödemeler' },
  { href: '/admin/expenses', label: 'Giderler' },
  { href: '/admin/reports', label: 'Raporlar' },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get('x-invoke-path') ?? headerList.get('next-url') ?? '/admin';
  const isLoggedIn = await readSessionFromCookies();

  return (
    <div className="min-h-screen bg-[var(--brand-dark)] text-[var(--brand-text)]">
      <header className="border-b border-[var(--brand-border)] bg-[var(--brand-dark2)]/60 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
          <Link
            href="/admin"
            className="font-[var(--font-display)] text-lg tracking-wide text-[var(--brand-primary)]"
          >
            Psefitone <span className="text-[var(--brand-accent)]">·</span> Yönetim
          </Link>

          {isLoggedIn ? (
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      active
                        ? 'rounded-md bg-[var(--sec-15)] px-3 py-1.5 text-sm font-medium text-[var(--brand-text)] ring-1 ring-[var(--sec-30)]'
                        : 'rounded-md px-3 py-1.5 text-sm text-[var(--brand-muted)] hover:bg-[var(--sec-8)] hover:text-[var(--brand-text)]'
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="ml-3 border-l border-[var(--brand-border)] pl-3">
                <LogoutButton />
              </div>
            </nav>
          ) : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10">{children}</main>
    </div>
  );
}
