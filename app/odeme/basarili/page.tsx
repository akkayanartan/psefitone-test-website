import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ödeme Başarılı — Psefitone",
  robots: { index: false, follow: false },
};

export default async function OdemeBasariliPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const rawOid = sp.merchant_oid ?? sp.oid;
  const merchantOid = typeof rawOid === "string" ? rawOid : undefined;

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-[var(--brand-dark)] text-[var(--brand-text)]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(134,41,255,0.14), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(227,224,170,0.06), transparent 60%)",
        }}
      />

      <main className="relative flex w-full max-w-[560px] flex-1 flex-col items-center justify-center px-5 py-14 text-center sm:px-8 sm:py-20">
        {/* Icon — explicit h/w so glow stays bounded */}
        <div className="relative h-20 w-20 shrink-0" style={{ marginBottom: "3.5rem" }}>
          <div
            className="absolute inset-[-1.25rem] rounded-full blur-2xl"
            aria-hidden="true"
            style={{ background: "rgba(134,41,255,0.22)" }}
          />
          <div
            className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(134,41,255,0.40)] bg-[var(--brand-dark3)]"
            aria-hidden="true"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--brand-primary)]"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <span
          className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Ödeme Alındı
        </span>

        <h1
          className="text-[clamp(1.9rem,5.5vw,2.75rem)] font-medium leading-[1.18]"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.018em",
            marginTop: "1.25rem",
          }}
        >
          Aramıza{" "}
          <em style={{ fontStyle: "italic", color: "var(--brand-primary)" }}>
            hoş geldin.
          </em>
        </h1>

        <p
          className="text-[0.95rem] leading-[1.9] text-[var(--brand-muted)]"
          style={{ fontFamily: "var(--font-body)", marginTop: "2.5rem" }}
        >
          Ödemen başarıyla alındı. Kayıt onayını ve grup erişim bilgilerini
          kısa süre içinde WhatsApp&apos;tan göndereceğim. 1 gün içinde
          herhangi bir şey gelmezse bana WhatsApp&apos;tan yaz.
        </p>

        {merchantOid ? (
          <div
            className="inline-flex items-center gap-2.5 rounded border border-[var(--brand-border)] bg-[var(--brand-dark3)] px-4 py-2.5"
            style={{ marginTop: "1.75rem" }}
          >
            <span
              className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--brand-muted)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Ref
            </span>
            <span className="font-mono text-sm text-[var(--brand-text)]">
              {merchantOid}
            </span>
          </div>
        ) : null}

        <div
          className="flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-center"
          style={{ marginTop: "3rem" }}
        >
          <a
            href="https://wa.me/905318197140?text=Merhaba%2C%20%C3%B6demeyi%20tamamlad%C4%B1m."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp w-full justify-center sm:w-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp&apos;tan ulaş
          </a>
          <Link
            href="/"
            className="text-sm text-[var(--brand-muted)] transition-colors duration-150 hover:text-[var(--brand-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-secondary)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Anasayfaya dön
          </Link>
        </div>
      </main>
    </div>
  );
}
