"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Marquee from "@/components/sections/Marquee";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_IDS: string[] = [
  "o3lTTOIGX_g",
  "JTwcdT2w5Tw",
  "KPjWSKhOEwc",
  "RuOCwBRDvYY",
  "QEWM6vPJwGk",
];

function baseSrc(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}


export default function VideoTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ reduced: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const { reduced } = ctx.conditions as { reduced: boolean };
        if (reduced) {
          gsap.set(
            [".vt-section .vt-header", ".vt-section .vt-grid", ".vt-section .cta-center"],
            { opacity: 1, y: 0 }
          );
          return;
        }

        gsap.fromTo(
          ".vt-section .vt-header",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".vt-section .vt-header",
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          ".vt-section .vt-grid",
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            delay: 0.15,
            scrollTrigger: {
              trigger: ".vt-section .vt-grid",
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          ".vt-section .cta-center",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".vt-section .cta-center",
              start: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="video-testimonials" className="vt-section">
      <div className="vt-inner">
        <div className="vt-header">
          <span className="vt-tag">Başlangıç Noktaları Sizinle Aynıydı</span>
          <h2 className="vt-title">
            Psefitone&apos;nun ilk gerçek deneyimleri.
          </h2>
          <p className="vt-subtitle" style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', maxWidth: '600px', marginInline: 'auto', lineHeight: '1.5' }}>
            Programa başlamadan önce hiçbirinin akordeon veya nota geçmişi yoktu.
          </p>
          <p style={{
            marginTop: '1.5rem',
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
          }}>
            <span style={{
              display: 'block',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: 'var(--brand-text)',
              marginBottom: '0.4rem',
            }}>
              Aşağıdaki videoları izle.
            </span>
            <span style={{
              display: 'block',
              fontSize: '1.55rem',
              fontWeight: 800,
              color: 'var(--brand-accent)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Bu sistem çalışıyor, onlar da kanıtı.
            </span>
          </p>
        </div>

        <Marquee />

        <div className="vt-grid">
          {VIDEO_IDS.map((id, index) => (
            <div key={id} className="vt-video-cell">
              <iframe
                src={baseSrc(id)}
                title={`Öğrenci yorumu ${index + 1}`}
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <p className="vt-scroll-hint" aria-hidden="true">← Sürükle veya kaydır →</p>

        <div className="cta-center" style={{ marginTop: "2rem" }}>
          <a href="#basvur" className="btn btn-primary btn-lg">
            Başvuru Formunu Doldur
          </a>
        </div>
      </div>
    </section>
  );
}
