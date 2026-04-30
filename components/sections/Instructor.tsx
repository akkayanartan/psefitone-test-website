"use client";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const credentials = [
  "Neredeyse 10 yıllık aktif akordeon geçmişi.",
  "Yüzlerce düğün ve özel etkinlikte icracı olarak sahne deneyimi; davetli müzisyen olarak çağrılan bir performans profili.",
  "Çerkes müziği camiasında duayen olarak tanınan, onlarca yıllık sahne tecrübesine sahip üst düzey müzisyenler tarafından takdirle karşılanan bir pedagojik yaklaşımın kurucusu.",
];

export default function Instructor() {
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
    <section className="section instructor-section" id="instructor" ref={sectionRef}>
      <div className="section-inner">
        <span className="section-tag gsap-reveal">Eğitmen</span>
        <div className="instructor-grid">
          <div className="instructor-photo-col gsap-reveal">
            <div className="instructor-photo">
              <Image
                src="/instructor.jpg"
                alt="Nartan Psefit Akkaya"
                loading="lazy"
                width={260}
                height={260}
              />
            </div>
          </div>

          <div className="instructor-text-col gsap-reveal">
            <h2 className="instructor-name">Nartan Psefit Akkaya</h2>
            <blockquote className="instructor-bio">
              &ldquo;Yıllarca sahnedeydim. Düzinelerce düğünde, yüzlerce saatin içindeydim. Fakat ben de seninle aynı yoldan geçtim. Başlangıçta öğrenmek çok fazla vakit ve emek aldı. Fakat zamanla fark ettim ki geleneksel yöntemimiz çalmayı öğretmiyor, müziği değil, sadece ezberlemeyi öğretiyor. Bu iki yaklaşım arasındaki fark, benim için her şeyi değiştirdi. Psefitone, işte bu fark üzerine kuruldu.&rdquo;
            </blockquote>
            <ul className="credentials">
              {credentials.map((c, i) => (
                <li key={i}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
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
