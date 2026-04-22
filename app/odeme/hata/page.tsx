import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ödeme Tamamlanmadı — Psefitone",
  robots: { index: false, follow: false },
};

export default async function OdemeHataPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const rawOid = sp.merchant_oid ?? sp.oid;
  const merchantOid = typeof rawOid === "string" ? rawOid : undefined;
  const rawReason = sp.reason ?? sp.failed_reason_msg;
  const reason = typeof rawReason === "string" ? rawReason : undefined;

  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--brand-dark)] text-[var(--brand-text)]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(134,41,255,0.08), transparent 60%)",
        }}
      />

      <main className="relative mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-8">
          <div
            className="absolute inset-0 rounded-full blur-2xl"
            aria-hidden="true"
            style={{ background: "rgba(227,224,170,0.18)" }}
          />
          <div
            className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(227,224,170,0.35)] bg-[var(--brand-dark3)]"
            aria-hidden="true"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--brand-accent)]"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <span
          className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Ödeme Tamamlanmadı
        </span>
        <h1
          className="mt-3 text-[clamp(2rem,4.4vw,3rem)] font-medium leading-[1.15]"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.018em",
          }}
        >
          Bir şey{" "}
          <em className="not-italic" style={{ fontStyle: "italic", color: "var(--brand-primary)" }}>
            ters gitti.
          </em>
        </h1>
        <p className="mt-5 max-w-[520px] text-[0.95rem] leading-relaxed text-[var(--brand-muted)]">
          Ödemen tamamlanamadı veya yarıda kesildi. Kartın bankasıyla ilgili bir
          durum olabilir. Tekrar denemeyi veya farklı bir kart kullanmayı dene.
          Sorun devam ederse bana WhatsApp&apos;tan yaz — birlikte çözeriz.
        </p>

        {reason ? (
          <div
            role="alert"
            className="mt-6 max-w-[480px] rounded-md border border-[rgba(227,224,170,0.25)] bg-[rgba(227,224,170,0.05)] px-4 py-3 text-sm leading-relaxed text-[var(--brand-accent)]"
          >
            {reason}
          </div>
        ) : null}

        {merchantOid ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark3)] px-4 py-2.5">
            <span className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--brand-muted)]">
              Ref
            </span>
            <span className="font-mono text-sm text-[var(--brand-text)]">
              {merchantOid}
            </span>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/odeme" className="btn btn-primary">
            Tekrar dene
          </Link>
          <a
            href="https://wa.me/905318197140?text=Merhaba%2C%20%C3%B6demeyi%20tamamlayam%C4%B1yorum."
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--brand-muted)] transition-colors hover:text-[var(--brand-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-secondary)]"
          >
            WhatsApp&apos;tan yardım al
          </a>
        </div>
      </main>
    </div>
  );
}
