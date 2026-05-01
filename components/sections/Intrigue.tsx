"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BULLETS: Array<{ before: string; strong: string; after: string }> = [
  {
    before:
      "İmrenerek izlediğiniz pşinawoların çalım tekniklerinin arkasındaki mantık ve bunları kendi parmak yapınıza ",
    strong: "nasıl uyarlayacağınız",
    after: "...",
  },
  {
    before:
      "Akordeon ile doğru duruş ve oturuşun neden teknik gelişimin önünde bir barikat oluşturduğu, ve bunu ",
    strong: "ilk haftadan nasıl doğru kurduğunuz",
    after: "...",
  },
  {
    before:
      "Sol el ve sağ eli birlikte koordineli çalmanın neden bu kadar zor göründüğü, ve ",
    strong: "bu koordinasyonu adım adım inşa eden yapılandırılmış egzersizler",
    after: "...",
  },
  {
    before:
      "Sadece körü körüne ezber yapmak yerine, Çerkes müziğinin matematiksel yapısını kavratarak yeni parçaları bağımsız olarak öğrenmenizi sağlayan ",
    strong: "metodun işleyişi",
    after: "...",
  },
  {
    before: `Ritim kaçırmanın `,
    strong: `parmak problemi değil, temel kavrama problemi`,
    after: ` olduğu gerçeği ve bunu kalıcı olarak nasıl düzelteceğiniz...`,
  },
  {
    before:
      "Günde 30 dakika disiplinli pratikle ilerleyebilmek için bir çalışma seansının nasıl yapılandırıldığı ve ",
    strong: "hangi sırayla çalışılması gerektiği",
    after: "...",
  },
];

export default function Intrigue() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 640px)",
          isDesktop: "(min-width: 641px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions as {
            isMobile: boolean;
            isDesktop: boolean;
            reducedMotion: boolean;
          };

          if (conditions.reducedMotion) {
            gsap.set(
              [".intrigue-tag", ".intrigue-title", ".intrigue-bullet"],
              { opacity: 1, y: 0 }
            );
            return;
          }

          gsap.fromTo(
            [".intrigue-tag", ".intrigue-title"],
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: ".intrigue-header",
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
          );

          gsap.fromTo(
            ".intrigue-bullet",
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: conditions.isMobile ? 0.05 : 0.08,
              scrollTrigger: {
                trigger: ".intrigue-list",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="section intrigue-section"
      id="intrigue"
    >
      <div className="intrigue-glow intrigue-glow--violet" aria-hidden="true" />
      <div className="intrigue-glow intrigue-glow--gold" aria-hidden="true" />

      <div className="section-inner">
        <div className="intrigue-content">
          <header className="intrigue-header">
            <span className="section-tag intrigue-tag">PROGRAM İÇERİĞİ</span>
            <h2 className="section-title intrigue-title">
              Bu Programda <em>Neler Keşfedeceksiniz?</em>
            </h2>
          </header>

          <ul className="intrigue-list">
            {BULLETS.map((bullet, i) => (
              <li key={i} className="intrigue-bullet">
                <svg
                  className="intrigue-question-mark"
                  viewBox="0 0 200 280"
                  aria-hidden="true"
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <text
                    x="50%"
                    y="78%"
                    textAnchor="middle"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontSize="280"
                    fontStyle="italic"
                    fontWeight="700"
                  >
                    ?
                  </text>
                </svg>
                <span className="intrigue-text">
                  {bullet.before}
                  <strong>{bullet.strong}</strong>
                  {bullet.after}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
