"use client";

import Script from "next/script";

interface Props {
  token: string;
}

export default function PayTRIframe({ token }: Props) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--brand-border)] bg-[var(--brand-dark3)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(134,41,255,0.15), transparent 70%)",
        }}
      />

      <div className="relative p-1.5 sm:p-2">
        <iframe
          src={`https://www.paytr.com/odeme/guvenli/${encodeURIComponent(token)}`}
          id="paytriframe"
          title="PayTR güvenli ödeme formu"
          frameBorder="0"
          scrolling="no"
          // PayTR's iframeResizer script sets the real height; this is just a
          // baseline so the frame doesn't collapse before the script loads.
          style={{ width: "100%", minHeight: "640px", border: "none" }}
          allow="payment"
        />
      </div>

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
    </div>
  );
}
