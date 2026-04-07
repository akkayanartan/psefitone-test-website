"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ForWhom() {
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
    <section className="section" id="for-whom" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-header gsap-reveal">
          <span className="section-tag">Bu Program</span>
          <h2 className="section-title">Senin için mi?</h2>
        </div>
        <div className="who-grid">
          {/* YES */}
          <div className="who-card who-yes gsap-reveal">
            <div className="who-card-head">
              <div className="who-icon who-icon--yes">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>Senin için</h3>
            </div>
            <ul className="who-list">
              <li>Hiç akordeon çalmamış, sıfırdan başlamak istiyorsan</li>
              <li>Daha önce denemişsin ama bırakmışsan ve bunun neden olduğunu anlamak istiyorsan</li>
              <li>Kültürünü taşıma isteği var ama nasıl başlayacağını bilmiyorsan</li>
              <li>Kafanda &ldquo;bir gün öğrenirim&rdquo; cümlesi varsa ve artık &ldquo;şimdi&rdquo; demek istiyorsan</li>
              <li>Düzenli pratik yapabilecek haftada en az 3-4 saatin varsa</li>
            </ul>
          </div>

          {/* NO */}
          <div className="who-card who-no gsap-reveal">
            <div className="who-card-head">
              <div className="who-icon who-icon--no">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h3>Senin için değil</h3>
            </div>
            <ul className="who-list">
              <li>Zaten çalıyorsun ve teknik geliştirme arıyorsan</li>
              <li>Hızlı sonuç istiyorsan ve pratik yapmak istemiyorsan</li>
              <li>Düğün performansı psikolojisi gibi ileri konular arıyorsan</li>
              <li>Zamanlama konusunda ciddi kısıtların varsa</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
