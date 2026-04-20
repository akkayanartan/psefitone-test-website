"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

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

      <nav 
        className={`nav${solid ? " nav--solid" : ""}`} 
        id="mainNav"
        style={{ top: isHome ? 'var(--banner-height)' : '0' }}
      >
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Psefitone - Ana Sayfa">
            <Image
              src="/horizontal-logo.png"
              alt="Psefitone"
              width={148}
              height={40}
              style={{ filter: "invert(1) brightness(0.92) sepia(0.15) hue-rotate(240deg)" }}
              priority
            />
          </Link>
          <a href="#basvur" className="btn btn-primary nav-cta">
            <span className="nav-cta-full">Başvuru Formunu Doldur</span>
            <span className="nav-cta-short">Başvur</span>
          </a>
        </div>
      </nav>
    </>
  );
}
