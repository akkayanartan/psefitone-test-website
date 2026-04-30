"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
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
    <>
      <style>{`
        .soundslice-iframe {
          height: 700px;
        }
        @media (max-width: 767px) {
          .soundslice-iframe {
            height: 480px !important;
          }
        }
      `}</style>
      <section className="section features-section" id="content" ref={sectionRef}>
        <div className="section-inner">
        {/* Soundslice interactive demo */}
        <div className="soundslice-block gsap-reveal">
          <div style={{
            textAlign: "center",
            maxWidth: "580px",
            margin: "0 auto 2rem",
          }}>
            <span style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "0.75rem",
            }}>Canlı Demo</span>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 2.5vw, 2.1rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#fff",
              marginBottom: "1rem",
            }}>
              Platformu Bizzat{" "}
              <em style={{ fontStyle: "italic", color: "var(--primary)" }}>Dene</em>
            </h3>
            <p style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              lineHeight: 1.8,
            }}>
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>Sorun:</strong> Geleneksel video dersler pasif'tir — seyredin, taklit edin. Tempoyu ayarlayamazsınız, zorlandığınız bölümü tekrar tekrar çalamazsınız. Öğrenme durur.
            </p>
            <p style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              lineHeight: 1.8,
              marginTop: "1.2rem"
            }}>
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>Çözüm:</strong> Soundslice, müzik öğrenmenin bugüne kadar geliştirilmiş en güçlü dijital aracıdır. Arayüzle etkileşime gir, tempoyu gerçek zamanda ayarla, istediğin bölümü sınırsız tekrar çal, nota okuyarak takip et. <strong style={{ color: "var(--text)", fontWeight: 600 }}>Aktif pratik.</strong> Bu pencere gerçek bir Psefitone dersidir — aşağıda dene.
            </p>
          </div>
          <div className="soundslice-wrapper">
            <iframe
              src="https://www.soundslice.com/slices/nS11c/embed/?force_top_video=1&hshrink=1"
              title="Soundslice — Canlı Akordeon Demo"
              width="100%"
              className="soundslice-iframe"
              allowFullScreen
            />
          </div>
        </div>

        <div className="cta-center gsap-reveal" style={{ marginTop: "4rem" }}>
          <a href="#basvur" className="btn btn-primary btn-lg">
            Başvuru Formunu Doldur
          </a>
        </div>
      </div>
      </section>
    </>
  );
}
