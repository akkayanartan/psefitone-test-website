"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const checkItems = [
  "Bir düğünde ya da aile buluşmasında akordeonu eline alıp ilk parçalarını çalabileceksin.",
  "Akordeonun evin köşesinde toz toplamayacak. Senin bir parçan olacak.",
  "Dinleyerek büyüdüğün parçaların nasıl çalındığını ve mantıklarını öğreneceksin.",
  "İmrenerek dinlediğin pşinavoların çalışma rutinlerini kendinde uygulayacaksın.",
  "Çerkes müziğini ve akordeonu anlamaya başlayacak, çift elle parçalar çalmaya başlayacaksın.",
];

export default function Outcomes() {
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

      gsap.utils.toArray<HTMLElement>(".checklist-item", sectionRef.current!).forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: item,
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
    <section className="section outcomes-section" id="outcomes" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-header gsap-reveal">
          <span className="section-tag">10 Hafta Sonunda</span>
          <h2 className="section-title">Ne değişecek?</h2>
        </div>
        <div className="outcomes-grid">
          <ul className="checklist" id="checklistItems">
            {checkItems.map((item, i) => (
              <li key={i} className="checklist-item">
                <span className="check-circle" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="highlight-card gsap-reveal">
            <h3>Bu sadece çalmayı öğrenmek değil.</h3>
            <p>
              &ldquo;Kültürünü taşıyacak biri olarak sahneye çıkmak, ailenin önünde çalmak, o anlara hazır olmak — bunun için sağlam bir temel gerekiyor. Psefitone bu temeli veriyor.&rdquo;
            </p>
            <a href="#basvur" className="btn btn-primary">
              Başvuru Formunu Doldur
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
