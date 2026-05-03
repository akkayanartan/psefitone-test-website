import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Giriş — Psefitone Yönetim',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--brand-primary)]">
        Yönetim Paneli
      </h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Devam etmek için yönetici şifresini girin.
      </p>

      <div className="mt-8 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-dark2)]/60 p-6">
        <LoginForm />
      </div>
    </div>
  );
}
