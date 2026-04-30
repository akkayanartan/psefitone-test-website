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
            P.S. Yukarıdaki her şeyi atlayıp direkt en alta inenler için bir özet:
          </h3>

          <div style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <ul style={{ paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem", listStyleType: "disc" }}>
                <li><strong style={{ color: "var(--brand-text)" }}>Sadece 10 haftada</strong> Çerkes müziğini çift elle ve ritim kaçırmadan çalmayı öğreniyorsun.</li>
                <li>Bu sadece bir kurs değil; teoriyi pratikle birleştiren, kanıtlanmış bir sistem.</li>
                <li>Ücret <strong style={{ color: "var(--brand-text)" }}>25.000 TL</strong> ve 10 hafta para iade garantisiyle tamamen risksiz.</li>
                <li>Birebir ilgilenebilmem için <strong style={{ color: "var(--brand-secondary)" }}>kontenjan sınırlı.</strong></li>
            </ul>
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
