import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import PayTRIframe from "@/components/payment/PayTRIframe";
import PayTRInstallmentWidget from "@/components/payment/PayTRInstallmentWidget";
import { fetchPaytrToken, generateMerchantOid, type BasketItem } from "@/lib/paytr";
import ReloadButton from "./ReloadButton";

export const metadata: Metadata = {
  title: "Ödeme — Psefitone Kickstarter 2. Kohort",
  description:
    "Başvurusu onaylanan adaylar için güvenli ödeme sayfası. PayTR altyapısı üzerinden 3D Secure ile ödeme.",
  robots: { index: false, follow: false },
};

// Always server-rendered on demand — token generation is per-request.
export const dynamic = "force-dynamic";

function absoluteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  return `${base}${path}`;
}

function getUserIp(hdrs: Headers): string {
  const xff = hdrs.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return hdrs.get("x-real-ip")?.trim() ?? "127.0.0.1";
}

async function generateToken(): Promise<{ token: string } | { error: string }> {
  const priceTl = Number(process.env.NEXT_PUBLIC_COURSE_PRICE_TL ?? 25000);
  const maxInstallment = Number(process.env.PAYTR_MAX_INSTALLMENT ?? 5);
  const hdrs = await headers();
  const userIp = getUserIp(hdrs);

  const merchantOid = generateMerchantOid("psf");
  const basket: BasketItem[] = [["Psefitone 2. Kohort", priceTl.toFixed(2), 1]];

  try {
    const result = await fetchPaytrToken({
      merchantOid,
      // Buyer details are collected via WhatsApp — use generic placeholders here.
      // PayTR's hosted iframe handles card entry and 3DS on their side.
      email: "ogrenci@psefitone.com",
      paymentAmountKurus: Math.round(priceTl * 100),
      userIp,
      userName: "Psefitone Öğrencisi",
      userPhone: "05000000000",
      userAddress: "Türkiye",
      basket,
      merchantOkUrl: absoluteUrl("/odeme/basarili"),
      merchantFailUrl: absoluteUrl("/odeme/hata"),
      maxInstallment,
    });

    if (result.status === "success" && result.token) {
      return { token: result.token };
    }

    console.error("[odeme] PayTR token rejected", result);
    return { error: result.reason ?? "PayTR ödeme bağlantısı oluşturulamadı." };
  } catch (err) {
    console.error("[odeme] token generation failed", err);
    return { error: "Sunucu hatası. Lütfen sayfayı yenileyin." };
  }
}

export default async function OdemePage() {
  const result = await generateToken();
  const priceTl = Number(process.env.NEXT_PUBLIC_COURSE_PRICE_TL ?? 25000);

  return (
    <div className="relative min-h-screen bg-[var(--brand-dark)] text-[var(--brand-text)]">
      <AtmosphericGlows />
      <BrandHeader />

      <main
        id="main-content"
        className="relative mx-auto w-full max-w-[860px] px-4 pb-24 pt-4 sm:px-8"
      >
        <PageHeader />

        <div className="mt-10">
          {"error" in result ? (
            <ErrorState message={result.error} />
          ) : (
            <PayTRIframe token={result.token} />
          )}
        </div>

        <PayTRInstallmentWidget amountTl={priceTl} maxInstallment={5} />

        <LegalFooter />
      </main>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function AtmosphericGlows() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 15% 20%, rgba(134,41,255,0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 85% 75%, rgba(227,224,170,0.06), transparent 60%)",
      }}
    />
  );
}

function BrandHeader() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-[860px] items-center justify-between px-4 py-6 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-baseline gap-0.5 text-[var(--brand-text)] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-secondary)]"
        aria-label="Psefitone anasayfaya dön"
      >
        <span
          className="text-xl sm:text-2xl font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Psefitone
        </span>
        <span
          className="ml-0.5 text-xl sm:text-2xl text-[var(--brand-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
          aria-hidden="true"
        >
          .
        </span>
      </Link>
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[var(--brand-muted)] transition-colors hover:text-[var(--brand-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-secondary)]"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-0.5"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Anasayfa
      </Link>
    </header>
  );
}

function PageHeader() {
  return (
    <div className="mx-auto max-w-[640px] text-center">
      <span
        className="inline-block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Güvenli Ödeme · 2. Kohort
      </span>
      <h1
        className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.15] text-[var(--brand-text)]"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.018em" }}
      >
        Başvurun onaylandı.{" "}
        <em className="not-italic" style={{ fontStyle: "italic", color: "var(--brand-primary)" }}>
          Kursa katıl.
        </em>
      </h1>
      <p className="mx-auto mt-4 max-w-[480px] text-[0.9rem] leading-relaxed text-[var(--brand-muted)]">
        Ödemen tamamlandığında kayıt onayı ve grup erişim bilgileri e-posta ile
        gönderilir. Kurs 4 Mayıs 2026&apos;da başlar.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-[560px] rounded-lg border border-[rgba(227,224,170,0.2)] bg-[var(--brand-dark3)] px-6 py-10 text-center">
      <div
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(227,224,170,0.3)] bg-[var(--brand-dark2)]"
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
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
      <p className="text-sm leading-relaxed text-[var(--brand-muted)]">{message}</p>
      <ReloadButton />
    </div>
  );
}

function LegalFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--brand-border)] pt-5 text-center text-xs leading-relaxed text-[var(--brand-muted)]">
      <p>
        Ödeme altyapısı{" "}
        <span className="text-[var(--brand-text)]">PayTR Virtual POS</span>{" "}
        tarafından sağlanır. Kart bilgileri 3D Secure ile doğrulanır ve
        sunucularımızda saklanmaz.
      </p>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link
          href="/mesafeli-satis-sozlesmesi"
          target="_blank"
          className="transition-colors hover:text-[var(--brand-text)]"
        >
          Mesafeli Satış Sözleşmesi
        </Link>
        <span aria-hidden="true" className="opacity-30">·</span>
        <Link
          href="/gizlilik-politikasi"
          target="_blank"
          className="transition-colors hover:text-[var(--brand-text)]"
        >
          Gizlilik Politikası
        </Link>
        <span aria-hidden="true" className="opacity-30">·</span>
        <Link
          href="/kullanim-kosullari"
          target="_blank"
          className="transition-colors hover:text-[var(--brand-text)]"
        >
          Kullanım Koşulları
        </Link>
      </p>
    </footer>
  );
}
