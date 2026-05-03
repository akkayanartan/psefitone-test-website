'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') ?? '/admin';

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      if (res.status === 401) setError('Şifre hatalı.');
      else setError('Bir sorun oluştu. Tekrar deneyin.');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-[var(--brand-muted)]">Şifre</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2 text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
        />
      </label>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || password.length === 0}
        className="rounded-md bg-[var(--brand-secondary)] px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_var(--sec-25)] transition-colors hover:bg-[var(--brand-secondary)]/90 disabled:opacity-60"
      >
        {pending ? 'Giriş yapılıyor…' : 'Giriş Yap'}
      </button>
    </form>
  );
}
