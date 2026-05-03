interface Props {
  courseTitle?: string;
  cohortLabel?: string;
  totalTl?: number;
  currency?: string;
}

export default function OrderSummaryCard({
  courseTitle = "Psefitone Kickstarter",
  cohortLabel,
  totalTl = 25000,
  currency = "TL",
}: Props) {
  return (
    <section
      aria-label="Sipariş özeti"
      className="relative overflow-hidden rounded"
      style={{
        background:
          "linear-gradient(135deg, var(--brand-dark3), var(--brand-dark2))",
        border: "1px solid var(--brand-border)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(203,195,214,0.05) inset",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 90% 0%, rgba(134,41,255,0.16), transparent 70%)",
          opacity: 0.85,
        }}
      />

      <div className="relative px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Sipariş Özeti
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-[var(--brand-accent)] opacity-70"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <h2
          className="mt-3 text-[1.2rem] sm:text-[1.3rem] font-medium leading-snug text-[var(--brand-text)]"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.01em",
          }}
        >
          {courseTitle}
        </h2>
        {cohortLabel ? (
          <p
            className="mt-1 text-[0.82rem] text-[var(--brand-muted)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {cohortLabel}
          </p>
        ) : null}

        <div
          className="mt-5 border-t pt-4"
          style={{ borderColor: "var(--brand-border)" }}
        />

        <div className="flex items-baseline justify-between gap-3">
          <span
            className="text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[var(--brand-muted)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Toplam
          </span>
          <span
            className="tabular-nums text-[1.5rem] sm:text-[1.65rem] font-medium leading-none text-[var(--brand-primary)]"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.01em",
            }}
          >
            {formatTl(totalTl)}{" "}
            <span className="text-[0.85rem] text-[var(--brand-muted)]">
              {currency}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

function formatTl(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
