import {
  fetchInstallmentRates,
  normalizeInstallmentRates,
  type NormalizedInstallment,
} from "@/lib/paytr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const priceTl = Number(process.env.NEXT_PUBLIC_COURSE_PRICE_TL ?? 0);
  const maxInstallment = Number(process.env.PAYTR_MAX_INSTALLMENT ?? 5);

  if (!Number.isFinite(priceTl) || priceTl <= 0) {
    return Response.json(
      { status: "error", reason: "Kurs fiyatı tanımlı değil" },
      { status: 500 },
    );
  }

  try {
    const raw = await fetchInstallmentRates();
    if (raw.status !== "success") {
      console.warn("[paytr.rates] upstream returned non-success", raw);
      return Response.json(
        { status: "error", rates: fallbackRates(priceTl, maxInstallment) },
        { status: 200 },
      );
    }

    const normalized = normalizeInstallmentRates(raw, priceTl, maxInstallment);
    return Response.json({ status: "success", rates: normalized });
  } catch (err) {
    console.error("[paytr.rates] fetch failed", err);
    return Response.json(
      { status: "error", rates: fallbackRates(priceTl, maxInstallment) },
      { status: 200 },
    );
  }
}

// Conservative fallback used when PayTR's rates API is unreachable.
// Rates are intentionally higher than typical market rates so the displayed
// total is never understated; PayTR's hosted iframe will show the real rate.
function fallbackRates(
  basePriceTl: number,
  maxInstallment: number,
): NormalizedInstallment[] {
  const approx: Record<number, number> = {
    1: 0,
    2: 2.5,
    3: 4.5,
    4: 6.5,
    5: 8.5,
  };
  const out: NormalizedInstallment[] = [];
  for (let i = 1; i <= maxInstallment; i++) {
    const ratePercent = approx[i] ?? 9.0;
    const totalTl = round2(basePriceTl * (1 + ratePercent / 100));
    const monthlyTl = round2(totalTl / i);
    out.push({ count: i, ratePercent, monthlyTl, totalTl });
  }
  return out;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
