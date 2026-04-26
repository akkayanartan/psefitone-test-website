import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";
import OdemeClient from "./OdemeClient";

export const metadata: Metadata = {
  title: "Ödeme — Psefitone Kickstarter 2. Kohort",
  description:
    "Başvurusu onaylanan adaylar için güvenli ödeme sayfası. PayTR altyapısı üzerinden 3D Secure ile ödeme.",
  robots: { index: false, follow: false },
};

export default function OdemePage() {
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
          <OdemeClient />
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

