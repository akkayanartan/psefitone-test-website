"use client";

import { useRef, useCallback } from "react";

const testimonials = [
  {
    quote: "Hiçbir şeyin tekniğini bilmeden çalıyordum. Neye bastığımı, neden bastığımı bilmiyordum. Şimdi parçanın içinde kaybolmuyorum; yapıyı görüyorum.",
    author: "Setenay Ö.",
  },
  {
    quote: "Bu kadar kapsamlı ve bu müziğe özel bir eğitim veren başka kimse yok. Başka bir şeyden daha önce duymuş olsaydım yıllarımı boşa harcamazdım.",
    author: "Cem K.",
  },
  {
    quote: "Online olacağına dair şüphem vardı. Yanılmışım. Soundslice sayesinde parmakları istediğim kadar yavaşlatıp tekrarlayabiliyorum. Yüz yüze derste bunu hiçbir hocadan isteyemezsiniz.",
    author: "Emrah A.",
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

  // Mobile: toggle pause on tap (touch-only — guard against desktop click)
  const handleClick = useCallback(() => {
    if (window.matchMedia("(hover: none)").matches) {
      outerRef.current?.classList.toggle("is-paused");
    }
  }, []);

  return (
    <div
      ref={outerRef}
      className={`marquee-outer${isReverse ? " marquee-row-second" : ""}`}
      tabIndex={0}
      role="group"
      aria-label={
        isReverse
          ? "Öğrenci geri bildirimleri (ters yön) — duraklatmak için tıklayın"
          : "Öğrenci geri bildirimleri — duraklatmak için tıklayın"
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          outerRef.current?.classList.toggle("is-paused");
        }
      }}
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
      <div className="marquee-rows">
        <MarqueeRow trackId="marqueeTrack" />
      </div>
    </div>
  );
}
