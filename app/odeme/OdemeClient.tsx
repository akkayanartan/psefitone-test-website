"use client";

import { useState } from "react";

import OrderSummaryCard from "@/components/payment/OrderSummaryCard";
import PaymentForm from "@/components/payment/PaymentForm";
import PayTRPaymentSheet from "@/components/payment/PayTRPaymentSheet";

export default function OdemeClient() {
  const [token, setToken] = useState<string | null>(null);
  const [merchantOid, setMerchantOid] = useState<string | null>(null);

  return (
    <div className="payment-stack">
      <OrderSummaryCard />

      <div className="payment-card">
        <div className="payment-card__inner">
          <PaymentForm
            onTokenIssued={(t, oid) => {
              setToken(t);
              setMerchantOid(oid);
            }}
          />
        </div>
      </div>

      <PayTRPaymentSheet
        open={!!token}
        token={token}
        merchantOid={merchantOid}
        onClose={() => {
          setToken(null);
          setMerchantOid(null);
        }}
      />
    </div>
  );
}
