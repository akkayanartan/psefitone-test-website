'use client';
import { useActiveSection } from '../lib/useActiveSection';

export default function SectionRail() {
  const { activeId, sections } = useActiveSection();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav aria-label="Sayfa bölümleri" className="section-rail">
      <div className="section-rail-line" aria-hidden="true" />
      {sections.map((section) => {
        const isActive = activeId === section.id;
        return (
          <button
            key={section.id}
            className={`section-rail-dot ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => scrollToSection(section.id)}
            aria-label={section.label}
          >
            <span className="section-rail-label">{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
