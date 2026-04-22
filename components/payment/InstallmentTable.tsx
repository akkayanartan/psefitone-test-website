import type { NormalizedInstallment } from "@/lib/paytr";

interface Props {
  rates: NormalizedInstallment[];
  currency?: string;
}

export default function InstallmentTable({ rates, currency = "TL" }: Props) {
  if (!rates?.length) return null;

  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--brand-border)] bg-[var(--brand-dark3)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 85% 0%, rgba(134,41,255,0.12), transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between border-b border-[var(--brand-border)] px-5 py-4 sm:px-6">
          <h3
            className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-accent)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Taksit Seçenekleri
          </h3>
          <span className="text-xs text-[var(--brand-muted)]">Banka kartı hariç</span>
        </div>

        <div role="table" aria-label="Taksit seçenekleri">
          <div
            role="row"
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] gap-3 border-b border-[var(--brand-border)] px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--brand-muted)] sm:px-6"
          >
            <span role="columnheader">Taksit</span>
            <span role="columnheader" className="text-right">Aylık</span>
            <span role="columnheader" className="text-right">Toplam</span>
          </div>

          {rates.map((r, i) => {
            const isBase = r.count === 1 || r.ratePercent === 0;
            return (
              <div
                key={r.count}
                role="row"
                className={[
                  "grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] items-baseline gap-3 px-5 py-3.5 sm:px-6",
                  i < rates.length - 1 ? "border-b border-[var(--brand-border)]" : "",
                  isBase ? "bg-[rgba(227,224,170,0.04)]" : "",
                ].join(" ")}
              >
                <span
                  role="cell"
                  className="flex items-baseline gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className="text-2xl font-medium text-[var(--brand-text)] leading-none">
                    {r.count}
                  </span>
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--brand-muted)]">
                    {r.count === 1 ? "Peşin" : "Ay"}
                  </span>
                </span>

                <span role="cell" className="text-right text-[var(--brand-text)]">
                  <span className="tabular-nums text-base sm:text-[1.05rem]">
                    {formatTl(r.monthlyTl)}
                  </span>
                  <span className="ml-1 text-xs text-[var(--brand-muted)]">{currency}</span>
                </span>

                <span role="cell" className="text-right">
                  <span
                    className={[
                      "tabular-nums text-sm sm:text-[0.95rem]",
                      isBase
                        ? "text-[var(--brand-accent)]"
                        : "text-[var(--brand-muted)]",
                    ].join(" ")}
                  >
                    {formatTl(r.totalTl)}
                  </span>
                  {!isBase && r.ratePercent > 0 ? (
                    <span className="ml-1.5 inline-flex items-center rounded border border-[rgba(134,41,255,0.25)] bg-[rgba(134,41,255,0.08)] px-1.5 py-0.5 text-[0.62rem] font-medium tracking-wide text-[var(--brand-primary)]">
                      +{r.ratePercent.toFixed(2)}%
                    </span>
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>

        <p className="border-t border-[var(--brand-border)] px-5 py-3 text-xs leading-relaxed text-[var(--brand-muted)] sm:px-6">
          Taksit farkları kart türüne göre değişebilir. Kesin oran ve nihai tutar
          ödeme sayfasında kart bilgilerinin girilmesinden sonra görüntülenir.
        </p>
      </div>
    </div>
  );
}

function formatTl(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
