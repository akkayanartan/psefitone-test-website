"use client";

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

// Duplicate for seamless loop
const allTestimonials = [...testimonials, ...testimonials];

export default function Marquee() {
  return (
    <div className="marquee-section" id="testimonials">
      <div className="section-inner">
        <span className="section-tag marquee-label">Öğrenci Geri Bildirimleri</span>
      </div>
      <div className="marquee-rows">
        {/* First row — default left scroll */}
        <div className="marquee-outer">
          <div className="marquee-fade-left" aria-hidden="true" />
          <div className="marquee-fade-right" aria-hidden="true" />
          <div className="marquee-track" id="marqueeTrack">
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

        {/* Second row — reverse right scroll (mobile only) */}
        <div className="marquee-outer marquee-row-second">
          <div className="marquee-fade-left" aria-hidden="true" />
          <div className="marquee-fade-right" aria-hidden="true" />
          <div className="marquee-track marquee-track-reverse" id="marqueeTrackReverse">
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
      </div>
    </div>
  );
}
