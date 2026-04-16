"use client";

import { useRef, useCallback } from "react";

const testimonials = [
  {
    quote: "Hiçbir şeyin tekniğini bilmeden çalıyordum. Şimdi her şey daha yerli yerine oturdu.",
    author: "Setenay Ö · 1. Kohort",
  },
  {
    quote: "Bu kadar kapsamlı bir eğitim veren başka kimse yok ve büyük ihtimalle olmayacak.",
    author: "Cem K · 1. Kohort",
  },
  {
    quote: "Sistemin online olması ve nota bilgisi verilmesi, bunu yüz yüze derslerden daha iyi yapıyor.",
    author: "Emrah A · 1. Kohort",
  },
  {
    quote: "Bu çalışmanın arşivlenmesi gerekiyor. Tekrar tekrar izlemek istiyorum.",
    author: "Setenay P · 1. Kohort",
  },
  {
    quote: "Verilen ücretin kat be katına değer.",
    author: "Samet Ç · 1. Kohort",
  },
  {
    quote: "Bilmediğimiz çok şey vardı. Bunları öğrenmek farklı bir bilinç kattı.",
    author: "Yunus Emre D · 1. Kohort",
  },
];

const allTestimonials = [...testimonials, ...testimonials];

function MarqueeRow({
  trackId,
  isReverse,
}: {
  trackId: string;
  isReverse?: boolean;
}) {
  const outerRef = useRef<HTMLDivElement>(null);

  // Desktop: pause on hover
  const handleMouseEnter = useCallback(() => {
    outerRef.current?.classList.add("is-paused");
  }, []);
  const handleMouseLeave = useCallback(() => {
    outerRef.current?.classList.remove("is-paused");
  }, []);

  // Mobile: toggle pause on tap
  const handleClick = useCallback(() => {
    outerRef.current?.classList.toggle("is-paused");
  }, []);

  return (
    <div
      ref={outerRef}
      className={`marquee-outer${isReverse ? " marquee-row-second" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="region"
      aria-label="Öğrenci geri bildirimleri — duraklatmak için tıklayın"
    >
      <div className="marquee-fade-left" aria-hidden="true" />
      <div className="marquee-fade-right" aria-hidden="true" />
      <div
        className={`marquee-track${isReverse ? " marquee-track-reverse" : ""}`}
        id={trackId}
      >
        {allTestimonials.map((t, i) => (
          <article
            key={i}
            className="marquee-card"
            aria-hidden={i >= testimonials.length ? "true" : undefined}
          >
            <p>&ldquo;{t.quote}&rdquo;</p>
            <span className="marquee-author">{t.author}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee-section" id="marquee">
      <div className="section-inner">
        <span className="section-tag marquee-label">Öğrenci Geri Bildirimleri</span>
      </div>
      <div className="marquee-rows">
        <MarqueeRow trackId="marqueeTrack" />
        <MarqueeRow trackId="marqueeTrackReverse" isReverse />
      </div>
    </div>
  );
}
