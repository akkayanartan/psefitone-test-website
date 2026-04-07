"use client";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const credentials = [
  "Yüzlerce düğünde sahne deneyimi",
  "Elbrus halk danslarına müzisyenlik",
  "Duayen müzisyenler tarafından desteklendi",
  "İlk kohort tamamlandı",
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
                alt="Psefit — Psefitone Kurucusu"
                loading="lazy"
                width={260}
                height={260}
              />
            </div>
          </div>

          <div className="instructor-text-col gsap-reveal">
            <h2 className="instructor-name">Psefit</h2>
            <p className="instructor-title">Psefitone Kurucusu · 7 Yıllık Sahne Deneyimi</p>
            <blockquote className="instructor-bio">
              &ldquo;7 yıl boyunca onlarca düğünde sahneye çıktım. Bu süreçte hem çalmayı hem de öğretmeyi merak ettim. Şu anki öğrenme yöntemimizde bir şeylerin eksik olduğunu gördüm. Psefitone, bu eksikliğe verdiğim cevap.&rdquo;
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
      </div>
    </section>
  );
}
