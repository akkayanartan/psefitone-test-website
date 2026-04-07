"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    title: "İnteraktif Ders Videoları",
    desc: "Soundslice altyapısıyla hazırlanan videolarda tempo kontrolü, nota entegrasyonu ve tekrar özelliği. Aynı dersi onlarca kez izleyebilirsin.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Haftalık Grup Seansları",
    desc: "Her hafta grup olarak bir araya gelip o haftanın materyalini birlikte çalışıyoruz. Çok daha verimli, çok daha iyi.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Birebir Koçluk",
    desc: "Her hafta birebir görüşme. Senin özel durumuna, çalma hatalarına ve ilerlemene özel geri bildirim.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "7/24 Geri Bildirim",
    desc: "İstediğin zaman, istediğin yerde çalışma videonu gönder. İster sabahın üçünde, ister tatil günlerinde. Fark etmiyor.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    title: "Metodoloji Odaklı Öğretim",
    desc: "Taklit değil, anlayış. Hangi parçayı, hangi tempoyu, hangi süslemeyi neden yaptığını öğrenirsin. Böylece öğrenmen 10 haftayla bitmiyor.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Kalite Öncelikli",
    desc: "Sınırlı kontenjan, yüksek kalite ve kişiselleştirilmiş bir deneyim.",
  },
];

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

      gsap.utils.toArray<HTMLElement>(".feature-card", sectionRef.current!).forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section className="section features-section" id="content" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-header gsap-reveal">
          <span className="section-tag">Program İçeriği</span>
          <h2 className="section-title">
            10 haftada Çerkes müziğini anla ve
            <br />
            ilk parçalarını çalmaya başla.
          </h2>
        </div>

        <div className="features-grid" id="featuresGrid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

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
              Aşağıdaki pencere gerçek bir Soundslice dersidir. Arayüzle etkileşime gir, tempoyu ayarla, istediğin bölümü tekrar çal.{" "}
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>
                Soundslice, müzik öğrenmenin bugüne kadar geliştirilmiş en güçlü dijital aracıdır.
              </strong>{" "}
              Pasif izleme değil, aktif pratik.
            </p>
          </div>
          <div className="soundslice-wrapper">
            <iframe
              src="https://www.soundslice.com/slices/nS11c/embed/"
              width="100%"
              height="500"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
