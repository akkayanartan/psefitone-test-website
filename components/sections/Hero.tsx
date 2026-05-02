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
        "#h-urgency",
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
      <ShaderBackground />

      <SparklesCore
        className="hero-sparkles"
        background="transparent"
        particleColor="#cbc3d6"
        particleDensity={60}
        minSize={0.4}
        maxSize={1.6}
        speed={1}
      />

      <div className="hero-glow hero-glow--main" aria-hidden="true" />
      <div className="hero-glow hero-glow--accent" aria-hidden="true" />
      <div className="hero-glow hero-glow--center" aria-hidden="true" />

      <div className="hero-content">
        {/* Section tag */}
        <span className="section-tag hero-tag" id="h-tag">
          AKORDEON ÖĞRENMEK İSTEYEN ÇERKES DİASPORASININ DİKKATİNE!
        </span>

        {/* Headline */}
        <h1 className="hero-headline" id="h-headline">
          Sadece <strong>10 HAFTADA</strong>, Hiçbir Nota ya da Akordeon Geçmişin Olmasa Bile,
          <br />
          <em><strong>Çift Elle Qafe Çalmaya Başlayın</strong></em>
        </h1>

        {/* Subtitle */}
        <p className="hero-sub" id="h-sub">
          Evrensel teoriye ve deneyime dayalı, yapılandırılmış bir program ile{" "}
          <em>Çerkes Müziğini</em> gerçekten anla ve repertuarını inşa et.
        </p>

        {/* Urgency block */}
        <div
          className="hero-urgency"
          id="h-urgency"
          role="region"
          aria-label="Kontenjan doluluk bilgisi"
        >
          <span className="hero-urgency-label">KONTENJAN DOLULUK ORANI</span>

          <div
            className="hero-urgency-track"
            role="progressbar"
            aria-valuenow={70}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Kontenjanın yüzde 70'i doldu"
          >
            <div className="hero-urgency-fill">
              <div className="hero-urgency-shimmer" aria-hidden="true" />
              <span className="hero-urgency-fill-label">%70 DOLU</span>
            </div>
            <div className="hero-urgency-edge" aria-hidden="true" />
          </div>

          <p className="hero-urgency-deadline">
            Son başvuru: <strong>4 Mayıs, gece yarısı</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
