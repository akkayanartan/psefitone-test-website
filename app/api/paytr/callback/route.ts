import { NextRequest } from "next/server";

import { verifyCallbackHash } from "@/lib/paytr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PayTR webhook. Publicly reachable. No session/middleware auth.
// PayTR retries every 60 seconds unless the response body is exactly "OK"
// with status 200.
//
// We intentionally return "OK" even for duplicate or already-seen events
// (idempotency) — any side effect below must be written idempotently.

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    console.error("[paytr.callback] failed to parse form body", err);
    // Returning non-OK triggers PayTR retries, which is correct here —
    // transient parse failures should get another shot.
    return new Response("BAD_REQUEST", { status: 400 });
  }

  const merchantOid = getField(form, "merchant_oid");
  const status = getField(form, "status");
  const totalAmount = getField(form, "total_amount");
  const hash = getField(form, "hash");

  if (!merchantOid || !status || !totalAmount || !hash) {
    console.error("[paytr.callback] missing required fields", {
      merchantOid,
      status,
      totalAmount,
      hasHash: !!hash,
    });
    return new Response("BAD_REQUEST", { status: 400 });
  }

  const verified = verifyCallbackHash({
    merchant_oid: merchantOid,
    status,
    total_amount: totalAmount,
    hash,
  });

  if (!verified) {
    // Do NOT return "OK" for bad hash — if PayTR's real POSTs were
    // mis-signed, something would already be wrong upstream.
    console.error("[paytr.callback] hash verification failed", {
      merchantOid,
      status,
    });
    return new Response("BAD_HASH", { status: 400 });
  }

  const paymentType = getField(form, "payment_type") ?? "";
  const failedReasonCode = getField(form, "failed_reason_code");
  const failedReasonMsg = getField(form, "failed_reason_msg");
  const paymentAmount = getField(form, "payment_amount");
  const currency = getField(form, "currency");

  if (status === "success") {
    if (process.env.NODE_ENV !== "production") {
      console.log("[paytr.callback] PAYMENT SUCCESS", {
        merchantOid,
        totalAmount,
        paymentAmount,
        currency,
        paymentType,
      });
    }
    // No app-side persistence: transaction records (success and failure)
    // live in the PayTR merchant dashboard, which is the source of truth.
  } else {
    console.warn("[paytr.callback] PAYMENT FAILED", {
      merchantOid,
      totalAmount,
      failedReasonCode,
      failedReasonMsg,
    });
    // No app-side persistence: failure records live in the PayTR dashboard.
  }

  // PayTR requires plain-text "OK" response. Anything else triggers retries.
  return new Response("OK", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function getField(form: FormData, key: string): string | null {
  const v = form.get(key);
  if (v == null) return null;
  return typeof v === "string" ? v : null;
}
