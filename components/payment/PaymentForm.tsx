"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Kept in sync with the server-side schema in app/api/paytr/token/route.ts.
// The server is the source of truth; this exists for inline UX feedback only.
const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ad Soyad en az 2 karakter olmalı")
    .max(120, "Ad Soyad çok uzun"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Geçerli bir e-posta adresi girin")
    .max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Telefon numarası eksik")
    .max(20)
    .regex(/^[+0-9 ()-]+$/, "Geçersiz telefon numarası"),
  address: z.string().trim().optional(),
  kvkk: z.literal(true, {
    message: "Devam etmek için onay vermeniz gerekir",
  }),
});

export type PaymentFormValues = z.infer<typeof schema>;

interface Props {
  onTokenIssued: (token: string, merchantOid: string) => void;
}

export default function PaymentForm({ onTokenIssued }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      kvkk: false as unknown as true,
    },
    mode: "onBlur",
  });

  async function onSubmit(values: PaymentFormValues) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/paytr/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
        }),
      });
      const data = (await res.json()) as {
        status: string;
        token?: string;
        merchantOid?: string;
        reason?: string;
      };
      if (!res.ok || data.status !== "success" || !data.token || !data.merchantOid) {
        setServerError(
          data.reason ??
            "Ödeme bağlantısı oluşturulamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
        );
        return;
      }
      onTokenIssued(data.token, data.merchantOid);
    } catch {
      setServerError(
        "Bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <FieldGroup title="İletişim">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel>Ad Soyad</FieldLabel>
                  <FormControl>
                    <StyledInput
                      {...field}
                      type="text"
                      autoComplete="name"
                      placeholder="Örn. Nart Akkaya"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel>E-posta</FieldLabel>
                  <FormControl>
                    <StyledInput
                      {...field}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="ornek@eposta.com"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel>Telefon</FieldLabel>
                  <FormControl>
                    <StyledInput
                      {...field}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+90 5XX XXX XX XX"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </FieldGroup>

        <FieldGroup title="Fatura Adresi">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FieldLabel>Açık Adres</FieldLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={3}
                    autoComplete="street-address"
                    placeholder="Mahalle, cadde, numara, ilçe, il"
                    className="block w-full rounded-md border border-[var(--brand-border)] bg-[rgba(14,10,26,0.6)] px-3.5 py-3 text-[0.95rem] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] outline-none transition-colors focus-visible:border-[var(--brand-secondary)] focus-visible:ring-2 focus-visible:ring-[rgba(134,41,255,0.25)] aria-invalid:border-destructive"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </FieldGroup>

        <FormField
          control={form.control}
          name="kvkk"
          render={({ field, fieldState }) => (
            <FormItem className="pt-2">
              <label className="flex cursor-pointer items-start gap-3 text-[0.86rem] leading-relaxed text-[var(--brand-muted)]">
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  className="mt-1 h-4 w-4 flex-none cursor-pointer accent-[var(--brand-secondary)]"
                />
                <span>
                  <a
                    href="/mesafeli-satis-sozlesmesi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-primary)] underline decoration-[rgba(203,195,214,0.3)] underline-offset-2 hover:decoration-[var(--brand-primary)]"
                  >
                    Mesafeli satış sözleşmesini
                  </a>{" "}
                  ve{" "}
                  <a
                    href="/gizlilik-politikasi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-primary)] underline decoration-[rgba(203,195,214,0.3)] underline-offset-2 hover:decoration-[var(--brand-primary)]"
                  >
                    gizlilik politikasını
                  </a>{" "}
                  okudum, kabul ediyorum.
                </span>
              </label>
              {fieldState.error ? (
                <p className="text-xs text-destructive">
                  {fieldState.error.message}
                </p>
              ) : null}
            </FormItem>
          )}
        />

        {serverError ? (
          <div
            role="alert"
            className="rounded-md border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)] px-4 py-3 text-sm text-[#fca5a5]"
          >
            {serverError}
          </div>
        ) : null}

        <div className="pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            style={{ width: "100%" }}
          >
            {submitting ? (
              <>
                <Spinner />
                <span>Yönlendiriliyor…</span>
              </>
            ) : (
              <span>Güvenli ödemeye geç</span>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-[var(--brand-muted)]">
            Kart bilgileri PayTR&apos;nin güvenli formunda alınır. Sunucularımıza
            kart verisi iletilmez.
          </p>
        </div>
      </form>
    </Form>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend
        className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <FormLabel
      className="text-[0.78rem] font-medium uppercase tracking-[0.12em] text-[var(--brand-muted)]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {children}
    </FormLabel>
  );
}

function StyledInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className="h-11 rounded-md border border-[var(--brand-border)] bg-[rgba(14,10,26,0.6)] px-3.5 py-2 text-[0.95rem] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] transition-colors focus-visible:border-[var(--brand-secondary)] focus-visible:ring-2 focus-visible:ring-[rgba(134,41,255,0.25)]"
      style={{ fontFamily: "var(--font-body)" }}
    />
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
