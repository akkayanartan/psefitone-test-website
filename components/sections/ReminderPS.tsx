"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ReminderPS() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".ps-content",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".ps-content",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="section"
      id="ps-reminder"
      style={{
        background: "var(--brand-dark)",
        paddingTop: "2rem",
        paddingBottom: "5rem",
        position: "relative",
        borderTop: "1px solid var(--brand-border)"
      }}
    >
      <div className="section-inner">
        <div
          className="ps-content"
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            background: "rgba(134,41,255,0.03)",
            border: "1px solid rgba(134,41,255,0.15)",
            borderRadius: "12px",
            padding: "2.5rem",
            position: "relative"
          }}
        >
          <h3 style={{
            color: "var(--brand-text)",
            fontSize: "1.2rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            fontFamily: "var(--font-display)"
          }}>
            P.S. Yukarıdaki her şeyi atlayıp direkt en alta inenler için:
          </h3>

          <div style={{ color: "var(--brand-muted)", fontSize: "0.98rem", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <p style={{ margin: 0 }}>
              Eğer şu ana kadar “<em>kulağım yok, yaşım geçti, parmaklarım yavaş</em>” diye düşünüp akordeona el sürmediysen — sorun sen değilsin, sorun bugüne kadar denediğin yol. <strong style={{ color: "var(--brand-text)" }}>10 hafta</strong> sonra çift elle, ritim kaçırmadan Qafe çalıyor olacaksın; üstelik yeni parçaları da kendi başına çözebileceksin.
            </p>
            <p style={{ margin: 0 }}>
              Ücret <strong style={{ color: "var(--brand-text)" }}>25.000 TL</strong>; tek seferde, kredi kartıyla 6 taksit ya da IBAN ile ödenebiliyor. Risk tamamen bende: 10 hafta sonunda hedefe ulaşamadıysan paranın tamamı iade ediliyor — <strong style={{ color: "var(--brand-text)" }}>dahası, hedefi başarana kadar seninle birebir çalışmaya ücretsiz devam ediyorum.</strong>
            </p>
            <p style={{ margin: 0 }}>
              Tek pürüz <strong style={{ color: "var(--brand-secondary)" }}>kontenjan</strong>: birebir ilgilenebilmem için sınırlı sayıda öğrenci alıyorum ve <strong style={{ color: "var(--brand-text)" }}>4 Mayıs 2026</strong> başlangıç tarihine az kaldı. Formu doldur, 24 saat içinde sana WhatsApp'tan bizzat dönüş yapayım.
            </p>
          </div>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <a href="#basvur" className="btn btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "0.95rem" }}>
              Hemen Başvurunu Yap
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
