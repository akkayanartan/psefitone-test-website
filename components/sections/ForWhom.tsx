"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Category = "yes" | "no";

const yesPersonas = [
  {
    id: "beginner",
    title: "Başlangıç",
    subtitle: "Hiç çalmadınız",
    description: "Sıfırdan başlamak istiyorsanız",
    icon: "🎹",
  },
  {
    id: "returner",
    title: "Geri Dönen",
    subtitle: "Bırakmışsınız",
    description: "Neden bıraktığınızı anlamak istiyorsanız",
    icon: "🔄",
  },
  {
    id: "preserver",
    title: "Koruyucu",
    subtitle: "Kültür önemli",
    description: "Mirası taşımak istiyorsanız",
    icon: "🌟",
  },
  {
    id: "now",
    title: "Şimdi!",
    subtitle: "Ertelemişsiniz",
    description: '"Bir gün" yerine "şimdi" demek istiyorsanız',
    icon: "⚡",
  },
];

const noPersonas = [
  {
    id: "advanced",
    title: "İleri Seviye",
    subtitle: "Zaten çalıyorsunuz",
    description: "Teknik geliştirme arıyorsanız",
    icon: "🎯",
  },
  {
    id: "quick",
    title: "Çabuk Sonuç",
    subtitle: "Pratik istemiyorsunuz",
    description: "Hızlı öğrenmeyi bekleyenler",
    icon: "⏱️",
  },
  {
    id: "advanced-topics",
    title: "İleri Konular",
    subtitle: "Spesifik teknikler",
    description: "Düğün/performans gibi konular arıyorsanız",
    icon: "🎭",
  },
  {
    id: "no-time",
    title: "Zaman Yok",
    subtitle: "Ciddi kısıtlar",
    description: "Haftada 3-4 saat yapamıyorsanız",
    icon: "🚫",
  },
];

export default function ForWhom() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("yes");

  useGSAP(
    () => {
      // Reveal section header
      gsap.fromTo(
        ".fw-header",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".fw-header",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      // Reveal toggle
      gsap.fromTo(
        ".fw-toggle",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          delay: 0.1,
          scrollTrigger: {
            trigger: ".fw-toggle",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      // Staggered reveal for persona cards
      gsap.utils.toArray<HTMLElement>(".fw-card", sectionRef.current!).forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: index * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  const personas = activeCategory === "yes" ? yesPersonas : noPersonas;
  const categoryColor = activeCategory === "yes" ? "var(--sec-15)" : "rgba(203,195,214,0.1)";
  const textColor = activeCategory === "yes" ? "var(--secondary)" : "var(--primary)";

  return (
    <section className="fw-section" id="for-whom" ref={sectionRef}>
      <div className="fw-container">
        {/* Header */}
        <div className="fw-header">
          <span className="fw-tag">Bu Program</span>
          <h2 className="fw-title">Senin için mi?</h2>
        </div>

        {/* Toggle */}
        <div className="fw-toggle">
          <div className="fw-toggle-buttons">
            <button
              className={`fw-toggle-btn ${activeCategory === "yes" ? "fw-toggle-btn--active" : ""}`}
              onClick={() => setActiveCategory("yes")}
              style={activeCategory === "yes" ? { backgroundColor: "var(--sec-15)" } : {}}
            >
              <span className="fw-toggle-icon">✓</span>
              <span>Senin için</span>
            </button>
            <button
              className={`fw-toggle-btn ${activeCategory === "no" ? "fw-toggle-btn--active" : ""}`}
              onClick={() => setActiveCategory("no")}
              style={activeCategory === "no" ? { backgroundColor: "rgba(203,195,214,0.1)" } : {}}
            >
              <span className="fw-toggle-icon">✕</span>
              <span>Senin için değil</span>
            </button>
          </div>
        </div>

        {/* Personas Grid */}
        <div className="fw-grid">
          {personas.map((persona) => (
            <div key={persona.id} className="fw-card" data-category={activeCategory}>
              <div className="fw-card-inner">
                {/* Icon */}
                <div
                  className="fw-card-icon"
                  style={{ backgroundColor: categoryColor, color: textColor }}
                >
                  {persona.icon}
                </div>

                {/* Content */}
                <div className="fw-card-content">
                  <h3 className="fw-card-title">{persona.title}</h3>
                  <p className="fw-card-subtitle">{persona.subtitle}</p>
                </div>

                {/* Hover Detail */}
                <div className="fw-card-detail">{persona.description}</div>

                {/* Accent Line */}
                <div
                  className="fw-card-accent"
                  style={
                    activeCategory === "yes"
                      ? { backgroundColor: "var(--secondary)" }
                      : { backgroundColor: "var(--primary)" }
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="cta-center gsap-reveal" style={{ marginTop: "4rem" }}>
          <a href="#basvur" className="btn btn-primary btn-lg">
            Başvuru Formunu Doldur
          </a>
        </div>
      </div>
    </section>
  );
}
