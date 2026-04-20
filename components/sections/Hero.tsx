"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SparklesCore } from "@/components/SparklesCore";
import ShaderBackground from "@/components/ui/shader-background";


export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>([
        "#h-tag",
        "#h-headline",
        "#h-sub",
        "#h-promise",
        "#h-actions",
      ]);

      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.2,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section className="hero" id="hero" ref={containerRef}>
      {/* WebGL shader background */}
      <ShaderBackground />

      {/* Sparkle particles layered on top of shader */}
      <SparklesCore
        className="hero-sparkles"
        background="transparent"
        particleColor="#cbc3d6"
        particleDensity={60}
        minSize={0.4}
        maxSize={1.6}
        speed={1}
      />

      {/* Vignette glows */}
      <div className="hero-glow hero-glow--main" aria-hidden="true" />
      <div className="hero-glow hero-glow--accent" aria-hidden="true" />
      <div className="hero-glow hero-glow--center" aria-hidden="true" />

      <div className="hero-content">
        <span className="section-tag hero-tag" id="h-tag">
          Psefitone Kickstarter — 2. Kohort
        </span>
        <h1 className="hero-headline" id="h-headline">
          Yaşatmak için,
          <br />
          <em>önce iyi öğren.</em>
        </h1>
        <p className="hero-sub" id="h-sub">
          Türkiye Çerkes diasporası için tasarlanan ilk modern akordeon metodolojisi.
        </p>


        <div className="hero-actions" id="h-actions">
          <a href="#basvur" className="btn btn-primary btn-lg">
            Başvuru Formunu Doldur
          </a>
          <p className="hero-note">Sınırlı kontenjan · Başlangıç: 4 Mayıs 2026</p>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-hint-line" />
      </div>
    </section>
  );
}
