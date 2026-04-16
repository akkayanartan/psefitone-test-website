"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// JSX nodes — key phrases rendered in accent style
const outcomes: React.ReactNode[] = [
  <>
    Bir düğünde ya da aile buluşmasında akordeonu eline alıp{" "}
    <em className="outcome-em">ilk parçalarını çalabileceksin.</em>
  </>,
  <>
    Akordeonun evin köşesinde{" "}
    <em className="outcome-em">toz toplamayacak.</em>{" "}
    Senin bir parçan olacak.
  </>,
  <>
    Dinleyerek büyüdüğün parçaların{" "}
    <em className="outcome-em">nasıl çalındığını</em>{" "}
    ve mantıklarını öğreneceksin.
  </>,
  <>
    İmrenerek dinlediğin pşinavoların{" "}
    <em className="outcome-em">çalışma rutinlerini</em>{" "}
    kendinde uygulayacaksın.
  </>,
  <>
    Çerkes müziğini anlayacak,{" "}
    <em className="outcome-em">çift elle parçalar</em>{" "}
    çalmaya başlayacaksın.
  </>,
];

function DiamondIcon() {
  return (
    <svg
      width="9" height="9" viewBox="0 0 10 10"
      fill="none" aria-hidden="true"
      style={{ flexShrink: 0, marginTop: "0.28rem" }}
    >
      <rect
        x="5" y="0.7"
        width="5.8" height="5.8"
        transform="rotate(45 5 5)"
        fill="var(--brand-accent)"
        opacity="0.8"
      />
    </svg>
  );
}

function OutcomeCard({
  text,
  padded = false,
}: {
  text: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      className="outcome-card"
      style={{
        background: "var(--brand-dark2)",
        border: "1px solid var(--brand-border)",
        borderRadius: "4px",
        padding: padded ? "2.25rem 2.75rem" : "2rem 2.25rem",
        display: "flex",
        gap: "1.1rem",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
        /* hover spring is applied via CSS class below */
        transition:
          "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.22s ease",
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

      <DiamondIcon />

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: padded ? "1.25rem" : "1.12rem",
          color: "var(--brand-text)",
          lineHeight: 1.72,
          margin: 0,
          flex: 1,
          fontWeight: 400,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function OrnamentCell() {
  return (
    <div style={{
      border: "1px solid var(--brand-border)",
      borderRadius: "4px",
      background: "var(--sec-8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80px",
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect
          x="14" y="2"
          width="16.97" height="16.97"
          transform="rotate(45 14 14)"
          fill="none"
          stroke="var(--brand-accent)"
          strokeWidth="0.8"
          opacity="0.3"
        />
        <rect
          x="14" y="8"
          width="8.49" height="8.49"
          transform="rotate(45 14 14)"
          fill="var(--brand-accent)"
          opacity="0.15"
        />
      </svg>
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

      const desktopCards = gsap.utils.toArray<HTMLElement>(".outcomes-desktop-layout .outcome-card", sectionRef.current!);
      const mobileCards  = gsap.utils.toArray<HTMLElement>(".outcomes-mobile-layout .outcome-card",  sectionRef.current!);

      desktopCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.65, ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
          }
        );
      });
      mobileCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.65, ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
          }
        );
      });

      gsap.fromTo(
        ".outcomes-quote-reveal",
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".outcomes-quote-reveal", start: "top 88%", toggleActions: "play none none none" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <>
      {/* Hover styles — desktop only, no layout properties */}
      <style>{`
        @media (min-width: 768px) {
          .outcome-card:hover {
            transform: translateY(-5px) scale(1.025);
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

          /* Emphasized phrase styles */
          .outcome-em {
            font-family: var(--font-display);
            font-style: italic;
            font-size: 1.18em;
            color: var(--brand-accent);
            font-weight: 500;
            letter-spacing: -0.015em;
            text-shadow: 0 0 22px rgba(227,224,170,0.28);
          }

          /* Staggered row widths */
          .outcomes-row1 {
            grid-template-columns: 3fr 2fr;
          }
          .outcomes-row3 {
            grid-template-columns: 2fr 3fr;
          }
          .outcomes-row2 {
            grid-template-columns: 1fr 2.6fr 1fr;
          }
        }

        @media (max-width: 767px) {
          .outcome-em {
            font-family: var(--font-display);
            font-style: italic;
            color: var(--brand-accent);
            font-weight: 500;
          }
          .outcomes-ornament { display: none; }
          .outcomes-desktop-layout { display: none !important; }
          .outcomes-mobile-layout {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            gap: 1rem !important;
            padding: 0.5rem 0 1.5rem 0 !important; /* padding prevents shadow clipping & gives space to scrollbar */
          }
          /* Hide scrollbar for cleaner look */
          .outcomes-mobile-layout::-webkit-scrollbar {
            display: none;
          }
          .outcomes-mobile-layout {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .outcomes-mobile-layout > div {
            scroll-snap-align: center;
            flex: 0 0 85% !important; /* Cards take up 85% of standard width */
          }
          .outcomes-mobile-layout .outcome-card p {
            min-width: 0;
            overflow-wrap: break-word;
            word-break: normal;
          }
          .outcomes-mobile-layout .outcome-card {
            min-width: 0;
          }
        }

        /* Desktop shows desktop layout, hides mobile layout */
        @media (min-width: 768px) {
          .outcomes-mobile-layout { display: none !important; }
        }
      `}</style>

      <section className="section" id="outcomes" ref={sectionRef} style={{ background: "var(--brand-dark)" }}>
        {/* Atmospheric glows */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(134,41,255,0.10), transparent)",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 40% 30% at 50% 15%, rgba(203,195,214,0.04), transparent)",
        }} />

        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div className="section-header outcomes-header-reveal" style={{ textAlign: "center" }}>
            <span className="section-tag">10 Hafta Sonunda</span>
            <h2 className="section-title">
              Ne <em>değişecek</em>?
            </h2>
          </div>

          {/* Desktop layout: staggered 3-row bento grid */}
          <div className="outcomes-desktop-layout" style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "960px", margin: "0 auto" }}>

            {/* Row 1 — wider left card */}
            <div className="outcomes-row1" style={{ display: "grid", gap: "0.85rem" }}>
              <OutcomeCard text={outcomes[0]} />
              <OutcomeCard text={outcomes[1]} />
            </div>

            {/* Row 2 — centered hero card flanked by ornaments */}
            <div className="outcomes-row2" style={{ display: "grid", gap: "0.85rem" }}>
              <div className="outcomes-ornament"><OrnamentCell /></div>
              <OutcomeCard text={outcomes[2]} padded />
              <div className="outcomes-ornament"><OrnamentCell /></div>
            </div>

            {/* Row 3 — wider right card (mirrored from row 1) */}
            <div className="outcomes-row3" style={{ display: "grid", gap: "0.85rem" }}>
              <OutcomeCard text={outcomes[3]} />
              <OutcomeCard text={outcomes[4]} />
            </div>
          </div>

          {/* Mobile layout: auto-scroll horizontal carousel (hidden on desktop) */}
          <div className="outcomes-mobile-layout" style={{ maxWidth: "960px", margin: "0 auto" }}>
            <OutcomeCard text={outcomes[0]} />
            <OutcomeCard text={outcomes[1]} />
            <OutcomeCard text={outcomes[2]} />
            <OutcomeCard text={outcomes[3]} />
            <OutcomeCard text={outcomes[4]} />
          </div>

          {/* Quote */}
          <div className="outcomes-quote-reveal" style={{
            maxWidth: "620px",
            margin: "3.5rem auto 0",
            textAlign: "center",
            padding: "0 1rem",
          }}>
            <div style={{
              width: "1px", height: "2.5rem",
              background: "linear-gradient(to bottom, transparent, rgba(134,41,255,0.3))",
              margin: "0 auto 1.5rem",
            }} />

            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.05rem",
              fontStyle: "italic",
              color: "var(--brand-primary)",
              lineHeight: 1.7,
              margin: 0,
            }}>
              &ldquo;Bu sadece çalmayı öğrenmek değil. Kültürünü taşıyacak biri olarak sahneye çıkmak, ailenin önünde çalmak, o anlara hazır olmak — bunun için sağlam bir temel gerekiyor.&rdquo;
            </p>

            <div style={{
              width: "1px", height: "2.5rem",
              background: "linear-gradient(to bottom, rgba(134,41,255,0.3), transparent)",
              margin: "1.5rem auto 0",
            }} />
          </div>
        </div>
      </section>
    </>
  );
}
