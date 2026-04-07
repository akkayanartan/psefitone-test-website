"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setSolid(scrollY > 40);

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
      setScrollWidth(pct);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="scroll-progress"
        style={{ width: `${scrollWidth}%` }}
        aria-hidden="true"
      />

      <nav className={`nav${solid ? " nav--solid" : ""}`} id="mainNav">
        <div className="nav-inner">
          <a href="/" className="nav-logo" aria-label="Psefitone - Ana Sayfa">
            <Image
              src="/horizontal-logo.png"
              alt="Psefitone"
              width={148}
              height={40}
              style={{ filter: "invert(1) brightness(0.92) sepia(0.15) hue-rotate(240deg)" }}
              priority
            />
          </a>
          <a href="#basvur" className="btn btn-primary nav-cta">
            Başvuru Formunu Doldur
          </a>
        </div>
      </nav>
    </>
  );
}
