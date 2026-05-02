import crypto from "node:crypto";

// Low-level PayTR Virtual POS helpers.
//
// Server-only. Never import from a Client Component — this module reads
// PAYTR_MERCHANT_KEY / PAYTR_MERCHANT_SALT, which must stay on the server.

const PAYTR_BASE = "https://www.paytr.com";
const TOKEN_ENDPOINT = `${PAYTR_BASE}/odeme/api/get-token`;
const RATES_ENDPOINT = `${PAYTR_BASE}/odeme/taksit-oranlari`;
export const IFRAME_BASE = `${PAYTR_BASE}/odeme/guvenli`;

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function b64hmac(payload: string, key: string): string {
  return crypto.createHmac("sha256", key).update(payload, "utf8").digest("base64");
}

function testModeFlag(): "0" | "1" {
  // Fail-loud: env var must be set explicitly to "0" (production) or "1" (test).
  // A missing/misspelled value would otherwise silently route real customers
  // through PayTR's test gateway (or vice versa).
  const v = process.env.PAYTR_TEST_MODE;
  if (v === "0" || v === "1") return v;
  throw new Error(
    "PAYTR_TEST_MODE must be set explicitly to \"0\" (production) or \"1\" (test).",
  );
}

function debugOnFlag(): "0" | "1" {
  return process.env.NODE_ENV === "production" ? "0" : "1";
}

// ---------------- Basket ----------------

// PayTR expects: base64( JSON.stringify([ [name, unitPrice, qty], ... ]) )
// unitPrice is a TL-decimal string like "25000.00".
export type BasketItem = [name: string, unitPrice: string, quantity: number];

export function encodeUserBasket(items: BasketItem[]): string {
  return Buffer.from(JSON.stringify(items), "utf8").toString("base64");
}

// ---------------- merchant_oid ----------------

// PayTR requires merchant_oid to be strictly alphanumeric (a-z, A-Z, 0-9),
// no hyphens/underscores, max 64 chars. We prefix with "psf" so logs are
// scannable, append timestamp for monotonic ordering, and append random
// bytes for collision-resistance.
export function generateMerchantOid(prefix = "psf"): string {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(6).toString("hex");
  const oid = `${prefix}${ts}${rand}`;
  return oid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 64);
}

// ---------------- Token generation (Step 1) ----------------

export interface TokenParams {
  merchantOid: string;
  email: string;
  paymentAmountKurus: number; // TL × 100, integer
  userIp: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  basket: BasketItem[];
  merchantOkUrl: string;
  merchantFailUrl: string;
  noInstallment?: 0 | 1;
  maxInstallment?: number;
  currency?: "TL" | "USD" | "EUR";
  timeoutLimit?: number;
  debugOn?: 0 | 1;
  langIsoCode?: "tr" | "en";
}

export function buildTokenRequestBody(p: TokenParams): URLSearchParams {
  const merchantId = requireEnv("PAYTR_MERCHANT_ID");
  const merchantKey = requireEnv("PAYTR_MERCHANT_KEY");
  const merchantSalt = requireEnv("PAYTR_MERCHANT_SALT");
  const testMode = testModeFlag();

  const noInstallment = String(p.noInstallment ?? 0);
  const maxInstallment = String(p.maxInstallment ?? Number(process.env.PAYTR_MAX_INSTALLMENT ?? 5));
  const currency = p.currency ?? "TL";
  const paymentAmount = String(p.paymentAmountKurus);
  const userBasket = encodeUserBasket(p.basket);

  // Exact concatenation order specified by PayTR iFrame API docs.
  const hashStr =
    merchantId +
    p.userIp +
    p.merchantOid +
    p.email +
    paymentAmount +
    userBasket +
    noInstallment +
    maxInstallment +
    currency +
    testMode +
    merchantSalt;

  const paytrToken = b64hmac(hashStr, merchantKey);

  return new URLSearchParams({
    merchant_id: merchantId,
    user_ip: p.userIp,
    merchant_oid: p.merchantOid,
    email: p.email,
    payment_amount: paymentAmount,
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: p.debugOn !== undefined ? String(p.debugOn) : debugOnFlag(),
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: p.userName,
    user_address: p.userAddress,
    user_phone: p.userPhone,
    merchant_ok_url: p.merchantOkUrl,
    merchant_fail_url: p.merchantFailUrl,
    timeout_limit: String(p.timeoutLimit ?? 30),
    currency,
    test_mode: testMode,
    lang: p.langIsoCode ?? "tr",
  });
}

export interface TokenResponse {
  status: "success" | "failed" | "error";
  token?: string;
  reason?: string;
}

export async function fetchPaytrToken(p: TokenParams): Promise<TokenResponse> {
  const body = buildTokenRequestBody(p);
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });
  return (await res.json()) as TokenResponse;
}

export function iframeUrl(token: string): string {
  return `${IFRAME_BASE}/${token}`;
}

// ---------------- Callback verification (Step 3) ----------------

export interface CallbackPayload {
  merchant_oid: string;
  status: string; // "success" | "failed"
  total_amount: string;
  hash: string;
}

export function verifyCallbackHash(p: CallbackPayload): boolean {
  const merchantKey = requireEnv("PAYTR_MERCHANT_KEY");
  const merchantSalt = requireEnv("PAYTR_MERCHANT_SALT");

  const hashStr = p.merchant_oid + merchantSalt + p.status + p.total_amount;
  const expected = b64hmac(hashStr, merchantKey);

  const a = Buffer.from(expected);
  const b = Buffer.from(p.hash || "");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ---------------- Installment rates ----------------

export interface InstallmentRatesResponse {
  status: "success" | "error";
  // PayTR returns a rates payload keyed by card family
  // (Bonus, World, Axess, Maximum, CardFinans, Paraf, Advantage, Combo).
  // The exact shape is not fully documented — treat as unknown and
  // normalize in the route handler.
  [key: string]: unknown;
}

export async function fetchInstallmentRates(): Promise<InstallmentRatesResponse> {
  const merchantId = requireEnv("PAYTR_MERCHANT_ID");
  const merchantKey = requireEnv("PAYTR_MERCHANT_KEY");
  const merchantSalt = requireEnv("PAYTR_MERCHANT_SALT");

  const requestId = crypto.randomBytes(8).toString("hex");
  const hashStr = merchantId + requestId + merchantSalt;
  const paytrToken = b64hmac(hashStr, merchantKey);

  const body = new URLSearchParams({
    merchant_id: merchantId,
    request_id: requestId,
    paytr_token: paytrToken,
  });

  const res = await fetch(RATES_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });
  return (await res.json()) as InstallmentRatesResponse;
}

// ---------------- Normalized installment view for UI ----------------

// For page display, we take the maximum rate across card families per
// installment count, so displayed totals are never lower than what the
// buyer will actually pay at checkout.
export interface NormalizedInstallment {
  count: number; // 1..maxInstallment
  ratePercent: number; // e.g. 2.35 (percent, not fraction)
  monthlyTl: number; // rounded to 2 decimals, in TL
  totalTl: number; // rounded to 2 decimals, in TL
}

// Extract rate array from a card-family entry. PayTR's exact shape is
// inconsistent in docs — this helper tries the common ones defensively.
function extractRates(entry: unknown): number[] | null {
  if (Array.isArray(entry) && entry.every((x) => typeof x === "number")) {
    return entry as number[];
  }
  if (entry && typeof entry === "object") {
    const obj = entry as Record<string, unknown>;
    if (Array.isArray(obj.rates)) return obj.rates as number[];
    if (Array.isArray(obj.oranlar)) return obj.oranlar as number[];
  }
  return null;
}

export function normalizeInstallmentRates(
  raw: InstallmentRatesResponse,
  basePriceTl: number,
  maxInstallment = 5,
): NormalizedInstallment[] {
  // Collect per-installment rates across every card family, take the max.
  const maxPerCount: number[] = new Array(maxInstallment).fill(0);

  for (const [key, value] of Object.entries(raw)) {
    if (key === "status" || key === "reason") continue;
    const rates = extractRates(value);
    if (!rates) continue;
    for (let i = 0; i < Math.min(rates.length, maxInstallment); i++) {
      const r = Number(rates[i]) || 0;
      if (r > maxPerCount[i]) maxPerCount[i] = r;
    }
  }

  const out: NormalizedInstallment[] = [];
  for (let i = 0; i < maxInstallment; i++) {
    const count = i + 1;
    const ratePercent = maxPerCount[i] || 0;
    const totalTl = round2(basePriceTl * (1 + ratePercent / 100));
    const monthlyTl = round2(totalTl / count);
    out.push({ count, ratePercent, monthlyTl, totalTl });
  }
  return out;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
