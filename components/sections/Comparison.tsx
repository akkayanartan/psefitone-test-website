"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  {
    label: "Öğretim modeli",
    traditional: "Taklit et, ezberle, tekrar et",
    psefitone: "Metodoloji önce: müziği anla, sonra çal",
  },
  {
    label: "Müfredat",
    traditional: "Yoktur; dersler doğaçlama ilerler",
    psefitone: "10 haftalık yapılandırılmış müfredat",
  },
  {
    label: "Geri bildirim",
    traditional: "Haftada bir, yüz yüze ders gününde",
    psefitone: "7/24 video gönder, hızlıca hatalarını anla",
  },
  {
    label: "Konum",
    traditional: "Fiziksel mekan zorunluluğu",
    psefitone: "Tamamen online, istediğin yerden erişim",
  },
  {
    label: "Müzik teorisi",
    traditional: "Genellikle öğretilmez",
    psefitone: "Temel teori müfredata entegre",
  },
  {
    label: "Ders materyali",
    traditional: "Yok veya dağınık",
    psefitone: "Soundslice: profesyonel müzik eğitim altyapısı",
  },
  {
    label: "Yapı ve takip",
    traditional: "Takip mekanizması yok",
    psefitone: "Bireysel gelişim takibi, haftalık birebir koçluk",
  },
  {
    label: "Bağımsızlık",
    traditional: "Hocaya sürekli bağımlı kalma riski",
    psefitone: "Öğrenmeyi öğrenmiş, bağımsız icracı kimliği",
  },
];

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".comparison-header",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".comparison-header",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".cmp-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            delay: i * 0.06,
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section className="section" id="karsilastirma" ref={sectionRef} style={{ position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-10%",
          top: "20%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(134,41,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      <div className="section-inner">
        {/* Header */}
        <div className="section-header comparison-header">
          <span className="section-tag">Neden Psefitone?</span>
          <h2 className="section-title">
            Geleneksel dersten{" "}
            <em>farkı</em> ne?
          </h2>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              maxWidth: "520px",
              margin: "1rem auto 0",
              lineHeight: 1.8,
            }}
          >
            Her iki formatı yan yana koy, farkı kendin gör.
          </p>
        </div>

        {/* Column headers */}
        <div
          className="cmp-col-headers"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0",
            marginBottom: "0.5rem",
            padding: "0 0 0 0",
          }}
        >
          <div style={{ padding: "0 1.25rem 0.75rem" }} />
          <div
            style={{
              padding: "0.75rem 1.25rem",
              textAlign: "center",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              opacity: 0.7,
            }}
          >
            Geleneksel Ders
          </div>
          <div
            style={{
              padding: "0.75rem 1.25rem",
              textAlign: "center",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--brand-secondary)",
            }}
          >
            Psefitone
          </div>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {rows.map((row, i) => (
            <div
              key={i}
              className="cmp-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                borderRadius: "8px",
                overflow: "hidden",
                background: "var(--dark2)",
                border: "1px solid var(--brand-border)",
              }}
            >
              {/* Label */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--brand-accent)",
                  borderRight: "1px solid var(--brand-border)",
                  background: "rgba(227,224,170,0.04)",
                }}
              >
                {row.label}
              </div>

              {/* Traditional */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  borderRight: "1px solid var(--brand-border)",
                  gap: "0.625rem",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "rgba(155,145,176,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                {row.traditional}
              </div>

              {/* Psefitone — glowing */}
              <div
                style={{
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  color: "var(--brand-text)",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  gap: "0.625rem",
                  background: "linear-gradient(135deg, rgba(134,41,255,0.10) 0%, rgba(134,41,255,0.04) 100%)",
                  position: "relative",
                }}
              >
                {/* Left accent bar */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: "2px",
                    borderRadius: "2px",
                    background: "var(--brand-secondary)",
                    boxShadow: "0 0 8px rgba(134,41,255,0.7), 0 0 20px rgba(134,41,255,0.35)",
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "rgba(134,41,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--brand-secondary)",
                    boxShadow: "0 0 6px rgba(134,41,255,0.4)",
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {row.psefitone}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom glow card */}
        <div
          style={{
            marginTop: "2.5rem",
            padding: "1.75rem 2rem",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(134,41,255,0.14) 0%, rgba(134,41,255,0.05) 100%)",
            border: "1px solid rgba(134,41,255,0.35)",
            boxShadow: "0 0 40px rgba(134,41,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(134,41,255,0.2)",
              border: "1px solid rgba(134,41,255,0.5)",
              boxShadow: "0 0 16px rgba(134,41,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--brand-secondary)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                fontWeight: 500,
                color: "#fff",
                lineHeight: 1.4,
                marginBottom: "0.35rem",
              }}
            >
              Psefitone sadece bir ders değil — bir <em style={{ fontStyle: "italic", color: "var(--brand-secondary)" }}>sistem</em>.
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--brand-muted)", lineHeight: 1.7 }}>
              Her adım birbirine bağlı: teori, pratik, geri bildirim ve takip. Sonuç: bağımsız, özgüvenli bir icracı.
            </p>
          </div>
          <a
            href="#basvur"
            className="btn btn-primary"
            style={{
              flexShrink: 0,
              padding: "0.75rem 1.75rem",
              background: "var(--brand-secondary)",
              color: "#fff",
              boxShadow: "0 0 24px rgba(134,41,255,0.45), 0 4px 16px rgba(134,41,255,0.3)",
            }}
          >
            Başvuru Formunu Doldur
          </a>
        </div>
      </div>
    </section>
  );
}
