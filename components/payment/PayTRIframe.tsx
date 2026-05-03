"use client";

import Script from "next/script";
import { useEffect } from "react";

interface Props {
  token: string;
  merchantOid?: string;
}

export default function PayTRIframe({ token, merchantOid }: Props) {
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (ev.origin !== "https://www.paytr.com") return;

      const data = ev.data as unknown;
      let status: "success" | "failed" | null = null;

      if (typeof data === "string") {
        const s = data.toLowerCase();
        if (s === "success" || s === "ok" || s.includes("success"))
          status = "success";
        else if (s === "fail" || s === "failed" || s.includes("fail"))
          status = "failed";
      } else if (data && typeof data === "object") {
        const obj = data as { status?: string; payment_status?: string };
        const s = (obj.status ?? obj.payment_status ?? "").toLowerCase();
        if (s === "success") status = "success";
        else if (s === "failed" || s === "fail") status = "failed";
      }

      if (process.env.NODE_ENV !== "production") {
        console.debug("[paytr.iframe] message", { origin: ev.origin, data, status });
      }

      if (!status) return;

      const oid = merchantOid ? encodeURIComponent(merchantOid) : "";
      if (status === "success") {
        window.location.href = `/odeme/basarili${oid ? `?merchant_oid=${oid}&status=success` : "?status=success"}`;
      } else {
        window.location.href = `/odeme/hata${oid ? `?merchant_oid=${oid}` : ""}`;
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [merchantOid]);

  return (
    <>
      <iframe
        src={`https://www.paytr.com/odeme/guvenli/${encodeURIComponent(token)}`}
        id="paytriframe"
        title="PayTR güvenli ödeme formu"
        frameBorder="0"
        scrolling="no"
        // PayTR's iframeResizer script sets the real height; this is just a
        // baseline so the frame doesn't collapse before the script loads.
        style={{ width: "100%", minHeight: "640px", border: "none", display: "block" }}
        allow="payment"
      />

      <Script
        src="https://www.paytr.com/js/iframeResizer.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const w = window as Window & {
            iFrameResize?: (
              opts: Record<string, unknown>,
              selector: string,
            ) => void;
          };
          if (typeof w.iFrameResize === "function") {
            w.iFrameResize({}, "#paytriframe");
          }
        }}
      />
    </>
  );
}
