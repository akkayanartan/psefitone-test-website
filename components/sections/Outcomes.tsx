"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// JSX nodes — key phrases rendered in accent style
const outcomes: React.ReactNode[] = [
  <>
    Hiç akordeon çalmamış biri olarak başladığınız bu sürecin sonunda, çift el kullanarak, ritim kaçırmadan <em className="outcome-em">Qafe çalabileceksiniz.</em>
  </>,
  <>
    Müziğin mantığını bildiğiniz için yeni parçaları <em className="outcome-em">kendi başınıza çözebileceksiniz.</em>
  </>,
  <>
    Dinleyerek büyüdüğünüz parçaların sadece sesini değil, matematiğini, ritmik yapısını ve <em className="outcome-em">melodik mantığını anlayacaksınız.</em>
  </>,
  <>
    "Kulağım yok, yaşım geçti, parmaklarım yavaş" inançlarını sistematik ilerlemenin somut kanıtıyla <em className="outcome-em">bizzat çürüteceksiniz.</em>
  </>,
  <>
    Akordeona her oturduğunuzda ne yapacağınızı bileceksiniz; oyalama değil, <em className="outcome-em">gerçek pratik yapacaksınız.</em>
  </>,
  <>
    Atalarımızın mirasını pasif bir izleyici olarak değil, onu aktif biçimde icra edebilen ve yaşatan biri olarak <em className="outcome-em">taşıyacaksınız.</em>
  </>,
  <>
    Düğünde ya da aile toplantısında müzisyen koltuğuna oturmaktan çekinmeyeceksiniz; o koltuğun <em className="outcome-em">gerçek sahibi olacaksınız.</em>
  </>
];

function OutcomeCard({ text }: { text: React.ReactNode }) {
  return (
    <div
      className="outcome-card"
      style={{
        background: "var(--brand-dark2)",
        border: "1px solid var(--brand-border)",
        borderRadius: "4px",
        padding: "2rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.22s ease",
      }}
    >
      {/* Corner atmosphere */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "120px", height: "120px",
        background: "radial-gradient(ellipse at 0% 0%, rgba(134,41,255,0.10), transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Top gradient edge */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(134,41,255,0.25), transparent)",
        pointerEvents: "none",
      }} />
      <p className="outcome-text" style={{ color: "var(--brand-text)", margin: 0, fontWeight: 400 }}>
        {text}
      </p>
    </div>
  );
}

export default function Outcomes() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".outcomes-header-reveal",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: "power2.out",
          scrollTrigger: { trigger: ".outcomes-header-reveal", start: "top 88%", toggleActions: "play none none none" },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>(".outcome-card", sectionRef.current!);
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.65, ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
          }
        );
      });

      gsap.fromTo(
        ".outcomes-cta-reveal",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".outcomes-cta-reveal", start: "top 88%", toggleActions: "play none none none" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <>
      <style>{`
        .outcomes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          max-width: 960px;
          margin: 0 auto;
        }

        .outcome-number {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--brand-accent);
          line-height: 1;
          letter-spacing: -0.03em;
          opacity: 0.85;
        }

        .outcome-text {
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .outcome-em {
          font-family: var(--font-body);
          font-style: italic;
          font-size: 1.08em;
          color: var(--brand-accent);
          font-weight: 500;
          letter-spacing: -0.015em;
          text-shadow: 0 0 22px rgba(227,224,170,0.28);
        }

        .outcome-card:hover {
          transform: translateY(-4px);
          border-color: rgba(134,41,255,0.35) !important;
          box-shadow:
            0 12px 40px rgba(134,41,255,0.22),
            0 4px 16px rgba(0,0,0,0.45);
          z-index: 2;
        }

        .outcome-card:active {
          transform: translateY(1px) scale(0.99) !important;
        }

        .outcome-card:focus-visible {
          outline: 2px solid var(--brand-secondary);
          outline-offset: 3px;
        }

        @media (max-width: 767px) {
          .outcomes-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .outcome-card {
            text-align: center;
            flex-direction: column;
            align-items: center;
            padding: 1.75rem 1.5rem;
          }
          .outcome-text {
            font-size: 1rem;
            line-height: 1.65;
          }
          .outcome-em {
            font-size: 1.12em;
          }
          .outcome-number {
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>

      <section className="section" id="outcomes" ref={sectionRef} style={{ background: "var(--brand-dark)" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(134,41,255,0.10), transparent)",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 40% 30% at 50% 15%, rgba(203,195,214,0.04), transparent)",
        }} />

        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-header outcomes-header-reveal" style={{ textAlign: "center" }}>
            <span className="section-tag">10 Hafta Sonunda</span>
            <h2 className="section-title">
              Ne <em>değişecek</em>?
            </h2>
          </div>

          <div className="outcomes-grid">
            {outcomes.map((text, i) => (
              <OutcomeCard key={i} text={text} />
            ))}
          </div>

          <div className="cta-center outcomes-cta-reveal" style={{ marginTop: "3rem" }}>
            <a href="#basvur" className="btn btn-primary btn-lg">
              Başvuru Formunu Doldur
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
