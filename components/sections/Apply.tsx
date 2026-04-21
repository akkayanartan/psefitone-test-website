"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Script from "next/script";

gsap.registerPlugin(ScrollTrigger);

export default function Apply() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal", sectionRef.current!).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section className="section apply-section" id="basvur" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-header gsap-reveal">
          <span className="section-tag">Başvuru</span>
          <h2 className="section-title">10 haftada başla.</h2>
          <p className="apply-intro">
            Formu doldur, başvurunu gönder. Geri kalanı ben hallediyorum.
          </p>
          <p style={{ marginTop: "1rem", color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: "1.7" }}>
            Kurs 10 hafta sürecektir.
          </p>
        </div>

        {/* Start date banner */}
        <div className="start-date-wrap gsap-reveal">
          <div className="start-date-banner">
            <div className="start-date-glow" aria-hidden="true" />
            <span className="start-date-label">Başlangıç Tarihi</span>
            <div className="start-date-display">
              <span className="start-date-day">4</span>
              <div className="start-date-divider" aria-hidden="true" />
              <div className="start-date-right">
                <span className="start-date-month">Mayıs</span>
                <span className="start-date-year">2026</span>
              </div>
            </div>
          </div>
        </div>



        {/* Guarantee block */}
        <div className="guarantee-high-impact gsap-reveal">
          <div className="guarantee-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h3 className="guarantee-hero-title">PARA İADE GARANTİSİ</h3>
          <p className="guarantee-hero-text">
            10 hafta boyunca grup ve birebir derslere eksiksiz katıldığın halde çift elle Çerkes müziği çalamazsan, ücretinin tamamı iade edilir.
          </p>
        </div>



        {/* Bonus Stack Redesign */}
        <div className="bonus-section-wrapper">
          <div className="bonus-atmosphere-glow" aria-hidden="true" />
          
          <div className="bonus-stack-header gsap-reveal">
            <span className="section-tag" style={{ color: "var(--brand-accent)" }}>Ekstra Değer</span>
            <h3 className="section-title">Programa Dahil <em>Bonuslar</em></h3>
          </div>

          <div className="bonus-cards-grid gsap-reveal" style={{ textAlign: "center" }}>
            <div className="bonus-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <h4 className="bonus-card-name">Çerkes Müziği Dijital Arşivi</h4>
              <p className="bonus-card-period" style={{ marginBottom: "0.8rem" }}>3 Aylık Erişim</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-muted)", marginBottom: "0.2rem" }}>Yaklaşık Değer:</span>
                <p className="bonus-card-value" style={{ marginBottom: "0" }}>10.000 TL</p>
              </div>
            </div>
            
            <div className="bonus-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <h4 className="bonus-card-name">Gelecek Eğitimlere Öncelikli Katılım</h4>
              <p className="bonus-card-period" style={{ marginBottom: "0.8rem" }}>%20 İndirim & Erken Erişim</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-muted)", marginBottom: "0.2rem" }}>Yaklaşık Değer:</span>
                <p className="bonus-card-value" style={{ marginBottom: "0" }}>14.999 TL</p>
              </div>
            </div>
            
            <div className="bonus-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <h4 className="bonus-card-name">Sınırsız Topluluk Destek Ağı</h4>
              <p className="bonus-card-period" style={{ marginBottom: "0.8rem" }}>Sürekli Erişim</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-muted)", marginBottom: "0.2rem" }}>Yaklaşık Değer:</span>
                <p className="bonus-card-value" style={{ marginBottom: "0" }}>Paha Biçilemez</p>
              </div>
            </div>
          </div>

          <div className="bonus-summary-glow gsap-reveal">
            <p className="bonus-total" style={{ margin: 0 }}>Toplam bonus değeri: <strong style={{ fontSize: "1.45rem" }}>25.000 TL+</strong></p>
          </div>
        </div>

        {/* Pricing Moved Here */}
        <div className="pricing-block gsap-reveal" style={{ marginTop: "2rem" }}>
          <p style={{ textAlign: "center", color: "var(--brand-accent)", fontSize: "0.9rem", marginBottom: "1.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            10 Haftalık Eğitim Bedeli
          </p>
          <div className="pricing-rows">
            <div className="pricing-row">
              <span className="pricing-row-label">Peşin Ücret</span>
              <span className="pricing-row-value">25.000 TL</span>
            </div>
            <div className="pricing-row">
              <span className="pricing-row-label">Taksitli Ücret</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--brand-muted)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.4 }}>
                  Farklı taksit seçenekleri başvurusu onaylanan<br />adaylara ödeme aşamasında sunulacaktır.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning notice */}
        <div className="warning-box gsap-reveal">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: "1px" }}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p>
            Formu doldurduktan sonra <strong>Gönder</strong> butonuna basmayı unutma. Gönderim
            yapılmadan başvurun sisteme ulaşmaz — dolayısıyla sana geri dönüş yapamam.
          </p>
        </div>

        {/* Quota notice with neon green accents */}
        <div
          className="quota-notice gsap-reveal"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.9rem",
            maxWidth: "620px",
            margin: "0 auto 2rem",
            padding: "1rem 1.2rem",
            background: "rgba(0, 255, 0, 0.04)",
            border: "1px solid rgba(0, 255, 0, 0.3)",
            borderRadius: "8px",
            color: "#e3e0aa",
            fontSize: "0.855rem",
            lineHeight: "1.65",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: "1px", color: "#39ff14" }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p>
            <span style={{ color: "#39ff14", fontWeight: "600" }}>Kontenjan sınırlı.</span> Başvurular geliş sırasına göre değerlendirilir; kontenjan dolduğunda form kapatılır. Başvuru yaptıysan fakat kontenjan dolduysa, seni <span style={{ color: "#39ff14", fontWeight: "600" }}>bekleme listesine</span> alıyorum.
          </p>
        </div>

        {/* JotForm embed */}
        <div className="form-wrapper gsap-reveal">
          <iframe
            id="JotFormIFrame-260575845473972"
            title="Psefitone Ön Kayıt ve Değerlendirme Formu"
            allow="geolocation; microphone; camera; fullscreen; payment"
            src="https://form.jotform.com/260575845473972"
            style={{ minWidth: "100%", maxWidth: "100%", height: "539px", border: "none", display: "block" }}
            scrolling="no"
            loading="lazy"
          />
          <Script
            src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"
            strategy="afterInteractive"
            onLoad={() => {
              if (typeof window !== "undefined") {
                const w = window as Window & { jotformEmbedHandler?: (sel: string, base: string) => void };
                w.jotformEmbedHandler?.(
                  "iframe[id='JotFormIFrame-260575845473972']",
                  "https://form.jotform.com/"
                );
              }
            }}
          />
        </div>

        {/* WhatsApp */}
        <div className="cta-center" style={{ marginTop: "2rem" }}>
          <a
            href="https://wa.me/905318197140?text=Merhaba%2C%20Psefitone%20Kickstarter%20hakk%C4%B1nda%20bir%20sorum%20var."
            className="btn btn-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Soruların için WhatsApp&apos;tan yaz
          </a>
        </div>
      </div>
    </section>
  );
}
