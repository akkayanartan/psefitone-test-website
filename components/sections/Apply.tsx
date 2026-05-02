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
      const mm = gsap.matchMedia();
      mm.add(
        { reduced: "(prefers-reduced-motion: reduce)", normal: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const items = gsap.utils.toArray<HTMLElement>(".gsap-reveal", sectionRef.current!);
          if ((ctx.conditions as { reduced: boolean }).reduced) {
            gsap.set(items, { opacity: 1, y: 0 });
            return;
          }
          items.forEach((el) => {
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
              },
            );
          });
        },
      );
    },
    { scope: sectionRef }
  );

  return (
    <section className="section apply-section" id="basvur" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-header gsap-reveal">
          <span className="section-tag">Özel Teklif</span>
          <h2 className="section-title">Reddedemeyeceğin Bir Teklif.</h2>
          <p className="apply-intro">
            10 haftalık yoğun eğitim ve hayat boyu kullanacağın tüm kaynaklar.
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

        {/* Bonus Stack Redesign */}
        <div className="bonus-section-wrapper" style={{ marginTop: "3rem" }}>
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
                <p className="bonus-card-value" style={{ marginBottom: "0" }}>15.000 TL</p>
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
        </div>

        {/* Value Stack */}
        <div className="value-stack-block gsap-reveal" style={{
          maxWidth: "600px",
          margin: "3rem auto",
          background: "var(--brand-dark2)",
          border: "1px solid var(--brand-border)",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
        }}>
          <h3 id="value-stack-heading" style={{ color: "var(--brand-text)", fontSize: "1.2rem", fontWeight: 600, textAlign: "center", marginBottom: "1.5rem" }}>
            Neler Alıyorsunuz?
          </h3>

          <table aria-labelledby="value-stack-heading" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ color: "var(--brand-muted)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left", paddingBottom: "0.75rem", borderBottom: "1px solid var(--brand-border)" }}>Bonus</th>
                <th style={{ color: "var(--brand-muted)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "right", paddingBottom: "0.75rem", borderBottom: "1px solid var(--brand-border)" }}>Değeri</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: "var(--brand-text)", fontSize: "0.95rem", padding: "0.85rem 0", borderBottom: "1px dashed var(--brand-border)" }}>10 Haftalık Ana Eğitim & Müfredat</td>
                <td style={{ color: "var(--brand-muted)", fontSize: "0.9rem", textAlign: "right", padding: "0.85rem 0", borderBottom: "1px dashed var(--brand-border)" }}>40.000 TL</td>
              </tr>
              <tr>
                <td style={{ color: "var(--brand-text)", fontSize: "0.95rem", padding: "0.85rem 0", borderBottom: "1px dashed var(--brand-border)" }}>Dijital Arşiv (3 Ay)</td>
                <td style={{ color: "var(--brand-muted)", fontSize: "0.9rem", textAlign: "right", padding: "0.85rem 0", borderBottom: "1px dashed var(--brand-border)" }}>10.000 TL</td>
              </tr>
              <tr>
                <td style={{ color: "var(--brand-text)", fontSize: "0.95rem", padding: "0.85rem 0", borderBottom: "1px dashed var(--brand-border)" }}>Gelecek Eğitimlerde Öncelik</td>
                <td style={{ color: "var(--brand-muted)", fontSize: "0.9rem", textAlign: "right", padding: "0.85rem 0", borderBottom: "1px dashed var(--brand-border)" }}>15.000 TL</td>
              </tr>
              <tr>
                <td style={{ color: "var(--brand-text)", fontSize: "0.95rem", padding: "0.85rem 0", borderBottom: "1px dashed var(--brand-border)" }}>Topluluk Desteği</td>
                <td style={{ color: "var(--brand-muted)", fontSize: "0.9rem", textAlign: "right", padding: "0.85rem 0", borderBottom: "1px dashed var(--brand-border)" }}>Paha Biçilemez</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style={{ color: "var(--brand-text)", fontSize: "1.1rem", fontWeight: 600, paddingTop: "1.25rem" }}>TOPLAM DEĞER</td>
                <td style={{ color: "var(--brand-accent)", fontSize: "1.3rem", fontWeight: 700, textDecoration: "line-through", textAlign: "right", paddingTop: "1.25rem" }}>65.000 TL</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pricing */}
        <div className="pricing-block gsap-reveal" style={{ marginTop: "2rem" }}>
          <p style={{ textAlign: "center", color: "var(--brand-accent)", fontSize: "0.9rem", marginBottom: "1.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Bugün Ödeyeceğiniz Tutar
          </p>
          <hr style={{ border: "none", borderTop: "1px solid var(--brand-border)", margin: "0 0 1.5rem" }} />
          <div className="pricing-feature" style={{ overflowX: "clip" }}>
            <div className="pricing-feature-glow" aria-hidden="true" />
            <span className="pricing-feature-label">Peşin Ücret</span>
            <div className="pricing-feature-figure">
              25.000 <span className="pricing-unit">TL</span>
            </div>
            <div className="pricing-feature-rule" />
          </div>

          {/* Payment options */}
          <hr style={{ border: "none", borderTop: "1px solid var(--brand-border)", margin: "1.4rem 0 1.2rem" }} />
          <p style={{ textAlign: "center", color: "var(--brand-muted)", fontSize: "0.73rem", letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: "1rem", fontFamily: "var(--font-body)" }}>
            Ödeme Yöntemleri
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {/* IBAN */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "var(--brand-dark)", border: "1px solid var(--brand-border)",
              borderRadius: "6px", padding: "0.65rem 1rem",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <rect x="3" y="8" width="18" height="13" rx="2" />
                <path d="M7 8V6a5 5 0 0 1 10 0v2" />
                <line x1="12" y1="13" x2="12" y2="16" />
              </svg>
              <div style={{ flex: 1 }}>
                <span style={{ color: "var(--brand-text)", fontSize: "0.84rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>IBAN</span>
                <span style={{ color: "var(--brand-muted)", fontSize: "0.78rem", fontFamily: "var(--font-body)", marginLeft: "0.5rem" }}>Havale / EFT</span>
              </div>
            </div>

            {/* Credit card — single payment */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "var(--brand-dark)", border: "1px solid var(--brand-border)",
              borderRadius: "6px", padding: "0.65rem 1rem",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <div style={{ flex: 1 }}>
                <span style={{ color: "var(--brand-text)", fontSize: "0.84rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>Kredi Kartı</span>
                <span style={{ color: "var(--brand-muted)", fontSize: "0.78rem", fontFamily: "var(--font-body)", marginLeft: "0.5rem" }}>Tek çekim</span>
              </div>
            </div>

            {/* Credit card — installments */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "var(--brand-dark)", border: "1px solid rgba(134,41,255,0.2)",
              borderRadius: "6px", padding: "0.65rem 1rem",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
                <line x1="7" y1="15" x2="9" y2="15" />
                <line x1="12" y1="15" x2="14" y2="15" />
                <line x1="17" y1="15" x2="19" y2="15" />
              </svg>
              <div style={{ flex: 1 }}>
                <span style={{ color: "var(--brand-text)", fontSize: "0.84rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>Kredi Kartı</span>
                <span style={{ color: "var(--brand-muted)", fontSize: "0.78rem", fontFamily: "var(--font-body)", marginLeft: "0.5rem" }}>6 taksite kadar</span>
              </div>
            </div>
          </div>

          <p style={{ color: "var(--brand-muted)", fontSize: "0.78rem", fontFamily: "var(--font-body)", lineHeight: 1.55, marginTop: "0.9rem", textAlign: "center" }}>
            Taksitli ödemelerde vade farkı uygulanacaktır.
          </p>

          <div style={{
            display: "flex", alignItems: "flex-start", gap: "0.5rem",
            marginTop: "1rem",
            padding: "0.8rem 1rem",
            background: "rgba(134,41,255,0.06)",
            border: "1px solid rgba(134,41,255,0.2)",
            borderRadius: "6px",
            textAlign: "left",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-secondary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ margin: 0, color: "var(--brand-muted)", fontSize: "0.82rem", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
              Ödeme seçenekleri yalnızca <strong style={{ color: "var(--brand-text)", fontWeight: 600 }}>formu dolduran ve kursa kabul edilen</strong> adaylara sunulacaktır.
            </p>
          </div>
        </div>

        {/* Guarantee block */}
        <div className="guarantee-high-impact gsap-reveal" style={{ marginTop: "3rem" }}>
          <div className="guarantee-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h3 className="guarantee-hero-title">PARA İADE GARANTİSİ</h3>
          <p className="guarantee-hero-text">
            10 hafta boyunca grup ve birebir derslere eksiksiz katıldığın ve verilen ödevleri yerine getirdiğin halde çift elle Çerkes müziği çalamazsan, ücretinin tamamı iade edilir. <strong>Dahası, sen bu hedefi başarana kadar seninle birebir çalışmaya ücretsiz devam etme sözü veriyorum.</strong>
          </p>
        </div>

        {/* Quota notice with neon green accents */}
        <div
          className="quota-notice gsap-reveal"
          style={{
            position: "relative",
            maxWidth: "600px",
            margin: "3rem auto 2rem",
            padding: "2rem 1.8rem",
            background: "rgba(57,255,20,0.05)",
            border: "2px solid rgba(57,255,20,0.4)",
            borderRadius: "8px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Atmospheric glow */}
          <div aria-hidden="true" style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", height: "120px",
            background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(57,255,20,0.12), transparent)",
            pointerEvents: "none",
          }} />
          {/* Icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#39ff14"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ display: "block", margin: "0 auto 1rem", opacity: 0.9 }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {/* Heading */}
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "#39ff14",
            marginBottom: "1rem",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}>
            Kontenjan Neden Sınırlı?
          </h3>
          {/* Body */}
          <p style={{ color: "#e3e0aa", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 1rem" }}>
            Bu bir video kurs değil. Sizinle birebir ilgilenmem, gelişiminizi takip etmem ve sorularınıza şahsen yanıt vermem gerekiyor. Kaliteyi koruyabilmek için alabileceğim kişi sayısı belli.
          </p>
          <p style={{ color: "#e3e0aa", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
            Başvurular geliş sırasına göre değerlendirilir; kontenjan dolduğunda form kapatılır. Başvuru yaptıysan fakat kontenjan dolduysa, seni{" "}
            <span style={{ color: "#39ff14", fontWeight: 600 }}>bekleme listesine</span>{" "}
            alıyorum.
          </p>
        </div>

        {/* Warning / Cost of Inaction */}
        <div className="warning-inaction-block gsap-reveal" style={{
          position: "relative",
          maxWidth: "600px",
          margin: "0 auto 3rem",
          padding: "2.2rem 2rem",
          background: "rgba(255, 30, 30, 0.09)",
          border: "2px solid rgba(255, 60, 60, 0.55)",
          borderRadius: "10px",
          overflow: "hidden",
        }}>
          {/* Atmospheric red glow */}
          <div aria-hidden="true" style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", height: "140px",
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,30,30,0.18), transparent)",
            pointerEvents: "none",
          }} />
          <h3 style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            fontFamily: "var(--font-body)",
            color: "#ff4444",
            fontSize: "1.4rem",
            marginBottom: "1.2rem",
            fontWeight: 700,
            textAlign: "center",
          }}>
            Harekete Geçmezsen Ne Olacak?
          </h3>
          <p style={{ color: "var(--brand-text)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "1rem", textAlign: "center" }}>
            Bu fırsatı değerlendirmezsen, önümüzdeki 6 ay boyunca yine aynı YouTube videolarını başa saracak, çaldığın şeyin mantığını anlamadan ezber yapmaya çalışacak ve düğünlerde sahneye çıkma özgüvenini <strong>asla</strong> bulamayacaksın.
          </p>
          <p style={{ color: "var(--brand-text)", fontSize: "1.05rem", lineHeight: 1.75, margin: 0, textAlign: "center" }}>
            Karar senin: Ya eski yöntemlerle vakit kaybetmeye devam et, ya da kendini kanıtlamış Psefitone formülüyle <strong>10 haftada bu işi çöz.</strong>
          </p>
        </div>

        {/* CTA action-zone header */}
        <div className="gsap-reveal" style={{
          position: "relative",
          maxWidth: "660px",
          margin: "0 auto 2.5rem",
          padding: "2.4rem 2.2rem",
          background: "rgba(134,41,255,0.08)",
          border: "1px solid rgba(134,41,255,0.35)",
          borderRadius: "12px",
          textAlign: "center",
          overflow: "hidden",
        }}>
          {/* Atmospheric glow */}
          <div aria-hidden="true" style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "90%", height: "120px",
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(134,41,255,0.22), transparent)",
            pointerEvents: "none",
          }} />
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
            fontWeight: 700,
            color: "var(--brand-accent)",
            lineHeight: 1.35,
            margin: 0,
          }}>
            Başvuru için tek yapman gereken formu doldurmak.
          </p>
        </div>

        {/* Process steps */}
        <div className="apply-process gsap-reveal" aria-labelledby="apply-process-heading">
          <h3 id="apply-process-heading" className="sr-only">Başvuru Süreci</h3>
          <div className="apply-process-line" aria-hidden="true" />
          <ol className="apply-process-steps">
            <li className="apply-process-step" style={{
              borderColor: "rgba(134,41,255,0.55)",
              boxShadow: "0 0 0 1px rgba(134,41,255,0.18), 0 4px 24px rgba(134,41,255,0.14)",
            }}>
              <span className="apply-process-numeral"><em>1</em></span>
              <div className="apply-process-body">
                <h4 className="apply-process-title" style={{ color: "var(--brand-text)", fontSize: "1.05rem" }}>Formu doldur</h4>
                <p className="apply-process-text">2-3 dakikanı alır.</p>
              </div>
            </li>
            <li className="apply-process-step">
              <span className="apply-process-numeral"><em>2</em></span>
              <div className="apply-process-body">
                <h4 className="apply-process-title">Başvurunu inceleyeceğim</h4>
                <p className="apply-process-text">24 saat içinde, kişisel olarak.</p>
              </div>
            </li>
            <li className="apply-process-step">
              <span className="apply-process-numeral"><em>3</em></span>
              <div className="apply-process-body">
                <h4 className="apply-process-title">WhatsApp&apos;tan dönüş yaparım</h4>
                <p className="apply-process-text">Uygun bulduğum adaylara ödeme bilgileriyle ulaşırım.</p>
              </div>
            </li>
          </ol>
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
            yapılmadan başvurun sisteme ulaşmaz — dolayısıyla sana geri dönüş yapamam. Gönderdiğin anda başvurun bana ulaşır. <strong>24 saat içinde WhatsApp&apos;tan sana yazıyorum.</strong>
          </p>
        </div>

        {/* Form lead-in */}
        <div className="gsap-reveal" style={{ textAlign: "center", margin: "2rem 0 1rem" }}>
          <span style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--brand-accent)",
          }}>
            ↓ Başvuru Formu
          </span>
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
