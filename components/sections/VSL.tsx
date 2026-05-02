"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VSL() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ reduced: "(prefers-reduced-motion: reduce)", normal: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        const { reduced } = ctx.conditions as { reduced: boolean };
        if (reduced) {
          gsap.set([".vsl-standalone .video-wrapper", ".vsl-standalone .hero-actions"], {
            opacity: 1,
            y: 0,
          });
          return;
        }

        gsap.fromTo(
          ".vsl-standalone .video-wrapper",
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".vsl-standalone .video-wrapper",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          ".vsl-standalone .hero-actions",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.3,
            scrollTrigger: {
              trigger: ".vsl-standalone .hero-actions",
              start: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="vsl" className="vsl-standalone">
      <div className="vsl-standalone-inner">
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube-nocookie.com/embed/Jqsh0ZUxnqk?autoplay=1&mute=1"
            title="Psefitone Tanıtım Videosu"
            allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <div className="hero-actions">
          <a href="#basvur" className="btn btn-primary btn-lg">
            Başvuru Formunu Doldur
          </a>
        </div>
      </div>
    </section>
  );
}
