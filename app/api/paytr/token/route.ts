import { NextRequest } from "next/server";
import { z } from "zod";

import {
  fetchPaytrToken,
  generateMerchantOid,
  type BasketItem,
} from "@/lib/paytr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Turkish-friendly validation: phone is loose (PayTR handles its own checks).
// TC Kimlik removed. Address relaxed.
const bodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(160),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[+0-9 ()-]+$/, "Geçersiz telefon numarası"),
  address: z.string().trim().optional(),
});

function getUserIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "127.0.0.1";
}

function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
  return `${base}${path}`;
}

export async function POST(req: NextRequest) {
  let parsedBody: z.infer<typeof bodySchema>;
  try {
    const raw = await req.json();
    parsedBody = bodySchema.parse(raw);
  } catch (err) {
    const message =
      err instanceof z.ZodError
        ? err.issues.map((i) => i.message).join(", ")
        : "Geçersiz istek gövdesi";
    return Response.json({ status: "error", reason: message }, { status: 400 });
  }

  const priceTl = Number(process.env.NEXT_PUBLIC_COURSE_PRICE_TL ?? 0);
  if (!Number.isFinite(priceTl) || priceTl <= 0) {
    return Response.json(
      { status: "error", reason: "Kurs fiyatı sunucuda tanımlı değil" },
      { status: 500 },
    );
  }
  const paymentAmountKurus = Math.round(priceTl * 100);
  const unitPriceTl = priceTl.toFixed(2);

  const basket: BasketItem[] = [["Psefitone 2. Kohort", unitPriceTl, 1]];
  const merchantOid = generateMerchantOid("psf");
  const userIp = getUserIp(req);

  const userName = parsedBody.name.slice(0, 60);
  const userPhone = parsedBody.phone.replace(/[^+0-9]/g, "").slice(0, 20);
  const userAddress = (parsedBody.address || "Türkiye").slice(0, 400);

  const maxInstallment = Number(process.env.PAYTR_MAX_INSTALLMENT ?? 5);

  try {
    const result = await fetchPaytrToken({
      merchantOid,
      email: parsedBody.email,
      paymentAmountKurus,
      userIp,
      userName,
      userPhone,
      userAddress,
      basket,
      merchantOkUrl: absoluteUrl("/odeme/basarili"),
      merchantFailUrl: absoluteUrl("/odeme/hata"),
      maxInstallment: Number.isFinite(maxInstallment) ? maxInstallment : 5,
      timeoutLimit: 15,
    });

    if (result.status !== "success" || !result.token) {
      console.error("[paytr.token] PayTR rejected token request", {
        merchantOid,
        status: result.status,
        reason: result.reason,
      });
      return Response.json(
        {
          status: "error",
          reason:
            result.reason ??
            "PayTR ödeme bağlantısı oluşturulamadı. Lütfen tekrar deneyin.",
        },
        { status: 502 },
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[paytr.token] token issued", { merchantOid });
    }

    return Response.json({
      status: "success",
      token: result.token,
      merchantOid,
    });
  } catch (err) {
    console.error("[paytr.token] unexpected error", err);
    return Response.json(
      { status: "error", reason: "Sunucu hatası. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
