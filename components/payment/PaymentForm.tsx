"use client";

import { useEffect, useState } from "react";
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
  // Defensive: prevents the pre-hydration window where a fast click on the
  // submit button would trigger a native form GET to /odeme?name=... and
  // re-render the page with empty defaults — the bug a customer hit on mobile.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

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
        onSubmit={(e) => {
          e.preventDefault();
          if (hydrated) void form.handleSubmit(onSubmit)(e);
        }}
        noValidate
        className="payment-form"
      >
        <FieldGroup
          label="İletişim"
          helper="Onay ve fatura bu bilgilere gönderilir."
        >
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
                <FormMessage className="payment-form__error" />
              </FormItem>
            )}
          />

          <div className="payment-form__row">
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
                  <FormMessage className="payment-form__error" />
                </FormItem>
              )}
            />

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
                  <FormMessage className="payment-form__error" />
                </FormItem>
              )}
            />
          </div>
        </FieldGroup>

        <FieldGroup label="Fatura Adresi" helper="Opsiyonel">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FieldLabel>Açık Adres</FieldLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={2}
                    autoComplete="street-address"
                    placeholder="Mahalle, cadde, numara, ilçe, il"
                    className="payment-form__textarea"
                  />
                </FormControl>
                <FormMessage className="payment-form__error" />
              </FormItem>
            )}
          />
        </FieldGroup>

        <FormField
          control={form.control}
          name="kvkk"
          render={({ field, fieldState }) => (
            <FormItem>
              <label
                className={`payment-form__consent${
                  fieldState.error ? " payment-form__consent--error" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  className="payment-form__checkbox"
                />
                <span className="payment-form__consent-text">
                  <a
                    href="/mesafeli-satis-sozlesmesi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mesafeli satış sözleşmesini
                  </a>{" "}
                  ve{" "}
                  <a
                    href="/gizlilik-politikasi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gizlilik politikasını
                  </a>{" "}
                  okudum, kabul ediyorum.
                </span>
              </label>
              {fieldState.error ? (
                <p className="payment-form__error">
                  {fieldState.error.message}
                </p>
              ) : null}
            </FormItem>
          )}
        />

        {serverError ? (
          <div role="alert" className="payment-form__alert">
            {serverError}
          </div>
        ) : null}

        <div className="payment-form__cta">
          <button
            type="button"
            onClick={() => {
              void form.handleSubmit(onSubmit)();
            }}
            disabled={!hydrated || submitting}
            className="payment-form__submit"
            aria-busy={submitting}
          >
            {submitting ? (
              <>
                <Spinner />
                <span>Yönlendiriliyor…</span>
              </>
            ) : (
              <>
                <LockIcon />
                <span>Güvenli ödemeye geç</span>
              </>
            )}
          </button>

          <div className="payment-form__trust">
            <TrustItem label="256-bit SSL" />
            <span aria-hidden="true">·</span>
            <TrustItem label="PayTR Sanal POS" />
            <span aria-hidden="true">·</span>
            <TrustItem label="3D Secure" />
          </div>

          <p className="payment-form__note">
            Kart bilgileri PayTR&apos;nin güvenli formunda alınır. Sunucularımıza
            kart verisi iletilmez.
          </p>
        </div>
      </form>
    </Form>
  );
}

function FieldGroup({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="payment-form__group">
      <div className="payment-form__group-head">
        <legend className="payment-form__group-label">{label}</legend>
        {helper ? (
          <span className="payment-form__group-helper">{helper}</span>
        ) : null}
      </div>
      <div className="payment-form__group-body">{children}</div>
    </fieldset>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <FormLabel className="payment-form__label">{children}</FormLabel>;
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="payment-form__input" />;
}

function TrustItem({ label }: { label: string }) {
  return (
    <span className="payment-form__trust-item">
      <LockIconSm />
      {label}
    </span>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LockIconSm() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="payment-form__spinner"
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
