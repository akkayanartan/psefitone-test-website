"use client";

import { useState } from "react";

import PaymentForm from "@/components/payment/PaymentForm";
import PayTRIframe from "@/components/payment/PayTRIframe";

export default function OdemeClient() {
  const [token, setToken] = useState<string | null>(null);
  const [merchantOid, setMerchantOid] = useState<string | null>(null);

  if (token) {
    return (
      <div className="overflow-hidden rounded border border-[rgba(134,41,255,0.22)]">
        {/* Branded header bar */}
        <div
          className="flex items-center justify-between border-b border-[rgba(134,41,255,0.2)] px-4 py-3"
          style={{ background: "rgba(134,41,255,0.09)" }}
        >
          <div className="flex items-center gap-2">
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--brand-primary)] opacity-80"
              aria-hidden="true"
            >
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
          <div className="flex items-center gap-3">
            {merchantOid ? (
              <span className="font-mono text-[0.62rem] text-[var(--brand-muted)]">
                Ref: {merchantOid}
              </span>
            ) : null}
            <span
              className="rounded-sm border border-[rgba(134,41,255,0.3)] bg-[rgba(134,41,255,0.1)] px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[var(--brand-primary)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              3D Secure
            </span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--brand-muted)]"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        {/* PayTR iframe */}
        <PayTRIframe token={token} />

        {/* Trust strip */}
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

  return (
    <PaymentForm
      onTokenIssued={(t, oid) => {
        setToken(t);
        setMerchantOid(oid);
      }}
    />
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
