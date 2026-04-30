'use client';
import { useEffect, useState } from 'react';
import { useActiveSection } from '../lib/useActiveSection';

export default function MobileSectionPulse() {
  const { activeId, activeIndex, sections } = useActiveSection();
  const [scrollY, setScrollY] = useState(0);
  const [basvurTop, setBasvurTop] = useState(99999);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const basvurEl = document.getElementById('basvur');
      if (basvurEl) {
        setBasvurTop(basvurEl.getBoundingClientRect().top);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSection = sections[activeIndex + 1];
  const isBasvur = activeId === 'basvur';
  const isHidden = scrollY < 80 || (!isBasvur && basvurTop < 220);

  const handleNext = () => {
    if (nextSection && !isBasvur) {
      document.getElementById(nextSection.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      className={`mobile-section-pulse ${isHidden ? 'pulse-hidden' : ''} ${isBasvur ? 'pulse-static' : ''}`}
      onClick={handleNext}
      disabled={isBasvur}
      aria-label={isBasvur ? `Şu an: Başvuru` : nextSection ? `Sonraki bölüme git: ${nextSection.label}` : ''}
    >
      {isBasvur ? (
        <span className="pulse-name">Şu an: Başvuru</span>
      ) : (
        <>
          <span className="pulse-numeral"><em>{activeIndex + 1} / {sections.length}</em></span>
          <span className="pulse-dot-sep" />
          <span className="pulse-name">{sections[activeIndex]?.labelShort || sections[activeIndex]?.label}</span>
          <svg className="pulse-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </>
      )}
    </button>
  );
}
