"use client";

import Script from "next/script";

const WIDGET_TOKEN = "302210be46bd042f37f2470182c121ba0eb88503459373f56cdc0852c947abd9";
const MERCHANT_ID = "694827";

interface Props {
  amountTl: number;
  maxInstallment?: number;
}

export default function PayTRInstallmentWidget({ amountTl, maxInstallment = 5 }: Props) {
  const src = `https://www.paytr.com/odeme/taksit-tablosu/v2?token=${WIDGET_TOKEN}&merchant_id=${MERCHANT_ID}&amount=${amountTl}&taksit=${maxInstallment}&tumu=0`;

  return (
    <div className="mt-10">
      {/* Section label */}
      <div className="mb-5 flex items-center gap-3">
        <span
          className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Taksit Seçenekleri
        </span>
        <div className="h-px flex-1 bg-[var(--brand-border)]" aria-hidden="true" />
      </div>

      {/* CSS overrides for PayTR widget */}
      <style>{`
        /* ── Container reset ── */
        #paytr_taksit_tablosu {
          clear: both;
          max-width: 100%;
          text-align: left;
          font-family: 'Montserrat', system-ui, sans-serif !important;
          background: transparent !important;
          color: #f0ecf8 !important;
          font-size: 13px;
        }
        #paytr_taksit_tablosu::before,
        #paytr_taksit_tablosu::after { content: ""; display: table; clear: both; }

        /* ── Bank card row ── */
        .taksit-tablosu-wrapper {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
          margin: 0 0 6px 0 !important;
          padding: 12px 14px !important;
          background: var(--brand-dark3, #231b35) !important;
          border: 1px solid rgba(203,195,214,0.12) !important;
          border-radius: 4px !important;
          overflow: hidden !important;
        }
        .taksit-tablosu-wrapper:last-child { margin-bottom: 0 !important; }

        /* ── Bank logo row ── */
        .taksit-logo {
          text-align: left !important;
          margin-bottom: 8px !important;
          overflow: hidden !important;
        }
        .taksit-logo img {
          max-height: 18px !important;
          display: block !important;
          filter: brightness(0) invert(1) !important;
          opacity: 0.65 !important;
        }

        /* ── Column header row ("Taksit Tutarı") ── */
        .taksit-tutari-text {
          float: left !important;
          width: auto !important;
          min-width: 80px !important;
          max-width: 30% !important;
          color: #9b91b0 !important;
          font-size: 0.6rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          font-family: 'Montserrat', system-ui, sans-serif !important;
          margin-bottom: 4px !important;
          padding-right: 8px !important;
          box-sizing: border-box !important;
        }

        /* ── Installment amount pill ── */
        .taksit-tutar-wrapper {
          display: inline-block !important;
          background: rgba(134,41,255,0.08) !important;
          border: 1px solid rgba(134,41,255,0.2) !important;
          border-radius: 3px !important;
          margin: 0 4px 4px 0 !important;
          transition: background 0.15s ease !important;
        }
        .taksit-tutar-wrapper:hover {
          background: rgba(134,41,255,0.18) !important;
        }
        .taksit-tutari {
          float: left !important;
          width: auto !important;
          min-width: 80px !important;
          max-width: 30% !important;
          padding: 5px 8px !important;
          color: #f0ecf8 !important;
          border: none !important;
          font-size: 0.78rem !important;
          font-family: 'Montserrat', system-ui, sans-serif !important;
          white-space: nowrap !important;
          box-sizing: border-box !important;
        }
        .taksit-tutari-bold {
          font-weight: 600 !important;
          color: #e3e0aa !important;
        }

        /* ── Mobile: tighter padding ── */
        @media (max-width: 480px) {
          .taksit-tablosu-wrapper {
            padding: 10px 12px !important;
          }
          .taksit-tutari-text,
          .taksit-tutari {
            min-width: 72px !important;
            max-width: 28% !important;
          }
          .taksit-tutari {
            font-size: 0.74rem !important;
            padding: 4px 6px !important;
          }
        }
      `}</style>

      {/* Widget wrapper */}
      <div
        className="overflow-hidden rounded border border-[var(--brand-border)]"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 85% 15%, rgba(134,41,255,0.07), transparent 65%), var(--brand-dark2)",
          padding: "14px",
        }}
      >
        <div id="paytr_taksit_tablosu" />
      </div>

      <p
        className="mt-3 text-[0.7rem] leading-relaxed text-[var(--brand-muted)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Taksit farkları kart türüne göre değişebilir. Kesin oran ödeme sırasında görüntülenir.
      </p>

      <Script src={src} strategy="afterInteractive" />
    </div>
  );
}
