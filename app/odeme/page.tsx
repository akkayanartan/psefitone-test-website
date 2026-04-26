import type { Metadata } from "next";
import { headers } from "next/headers";

import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";
import PayTRIframe from "@/components/payment/PayTRIframe";
import { fetchPaytrToken, generateMerchantOid, type BasketItem } from "@/lib/paytr";
import ReloadButton from "./ReloadButton";

export const metadata: Metadata = {
  title: "Ödeme — Psefitone Kickstarter 2. Kohort",
  description:
    "Başvurusu onaylanan adaylar için güvenli ödeme sayfası. PayTR altyapısı üzerinden 3D Secure ile ödeme.",
  robots: { index: false, follow: false },
};

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

  return (
    <div className="relative min-h-screen bg-[var(--brand-dark)] text-[var(--brand-text)]">
      <AtmosphericGlows />
      <Nav />

      <main
        id="main-content"
        className="relative flex w-full max-w-[640px] flex-col items-center"
        style={{
          marginInline: "auto",
          paddingTop: "clamp(7rem, 14vw, 9rem)",
          paddingBottom: "5rem",
          paddingInline: "1.5rem",
        }}
      >
        <PageHeader />

        <div style={{ marginTop: "2.5rem", width: "100%" }}>
          {"error" in result ? (
            <ErrorState message={result.error} />
          ) : (
            <PaymentSection token={result.token} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Atmospheric background ─────────────────────────────────── */

function AtmosphericGlows() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
      style={{
        background: [
          "radial-gradient(ellipse 70% 55% at 5% 10%, rgba(134,41,255,0.13), transparent 65%)",
          "radial-gradient(ellipse 50% 45% at 90% 80%, rgba(227,224,170,0.07), transparent 60%)",
          "radial-gradient(ellipse 35% 30% at 50% 110%, rgba(134,41,255,0.07), transparent 55%)",
        ].join(", "),
      }}
    />
  );
}

/* ─── Page header ─────────────────────────────────────────────── */

function PageHeader() {
  return (
    <div className="text-center">
      {/* Security pill */}
      <div
        className="inline-flex items-center gap-2 rounded-full border border-[rgba(134,41,255,0.3)] bg-[rgba(134,41,255,0.09)] px-4 py-2"
      >
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
          <path
            d="M5.5 0L0 2.25v3.5c0 3.08 2.34 5.96 5.5 6.75C8.66 11.71 11 8.83 11 5.75v-3.5L5.5 0z"
            fill="var(--brand-accent)"
            opacity="0.85"
          />
        </svg>
        <span
          className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Güvenli Ödeme · 2. Kohort
        </span>
      </div>

      <h1
        className="mt-5 text-[clamp(1.8rem,7vw,2.75rem)] font-medium leading-[1.1] text-[var(--brand-text)]"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        Başvurun onaylandı.{" "}
        <em style={{ fontStyle: "italic", color: "var(--brand-primary)" }}>
          Kursa katıl.
        </em>
      </h1>

      <p
        className="mx-auto mt-4 max-w-[380px] text-[0.85rem] leading-relaxed text-[var(--brand-muted)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Ödemen tamamlandığında kayıt onayı ve grup erişim bilgileri WhatsApp ile gönderilir.
      </p>
    </div>
  );
}

/* ─── Payment section (iframe + branded frame) ───────────────── */

function PaymentSection({ token }: { token: string }) {
  return (
    <div className="overflow-hidden rounded border border-[rgba(134,41,255,0.22)]">
      {/* Branded header bar above iframe */}
      <div
        className="flex items-center justify-between border-b border-[rgba(134,41,255,0.2)] px-4 py-3"
        style={{ background: "rgba(134,41,255,0.09)" }}
      >
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-primary)] opacity-80" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span
            className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--brand-text)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Kart Bilgileri
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-sm border border-[rgba(134,41,255,0.3)] bg-[rgba(134,41,255,0.1)] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[var(--brand-primary)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            3D Secure
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-muted)]" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
      </div>

      {/* PayTR iframe — no styling modifications inside */}
      <PayTRIframe token={token} />

      {/* Trust strip below iframe */}
      <div
        className="border-t border-[rgba(134,41,255,0.15)] px-4 py-3"
        style={{ background: "rgba(14,10,26,0.7)" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <TrustBadge icon="lock" label="256-bit SSL" />
          <TrustBadge icon="credit-card" label="Kart verisi saklanmaz" />
          <TrustBadge icon="paytr" label="PayTR Virtual POS" />
        </div>
      </div>
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: "lock" | "credit-card" | "paytr"; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon === "lock" && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-muted)] opacity-70" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )}
      {icon === "credit-card" && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-muted)] opacity-70" aria-hidden="true">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      )}
      {icon === "paytr" && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-muted)] opacity-70" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )}
      <span
        className="text-[0.67rem] text-[var(--brand-muted)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Error state ─────────────────────────────────────────────── */

function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="overflow-hidden rounded border border-[rgba(227,224,170,0.18)]"
      style={{
        background: "linear-gradient(135deg, var(--brand-dark3), var(--brand-dark2))",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(227,224,170,0.4), transparent)" }}
        aria-hidden="true"
      />
      <div className="px-6 py-10 text-center">
        <div
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(227,224,170,0.25)] bg-[rgba(227,224,170,0.06)]"
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--brand-accent)]">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p
          className="text-[0.875rem] leading-relaxed text-[var(--brand-muted)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {message}
        </p>
        <ReloadButton />
      </div>
    </div>
  );
}

