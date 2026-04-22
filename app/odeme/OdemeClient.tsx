"use client";

import { useState } from "react";

import PaymentForm from "@/components/payment/PaymentForm";
import PayTRIframe from "@/components/payment/PayTRIframe";

export default function OdemeClient() {
  const [token, setToken] = useState<string | null>(null);
  const [merchantOid, setMerchantOid] = useState<string | null>(null);

  if (token) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[var(--brand-muted)]">
          <span className="uppercase tracking-[0.16em] text-[var(--brand-accent)]">
            Güvenli Ödeme
          </span>
          {merchantOid ? (
            <span className="font-mono text-[0.7rem]">Ref: {merchantOid}</span>
          ) : null}
        </div>
        <PayTRIframe token={token} />
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
