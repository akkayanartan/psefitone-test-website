'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-md px-3 py-1.5 text-sm text-[var(--brand-muted)] hover:bg-[var(--sec-8)] hover:text-[var(--brand-text)] disabled:opacity-60"
    >
      {pending ? 'Çıkılıyor…' : 'Çıkış'}
    </button>
  );
}
