'use client';
import { useState, useEffect } from 'react';

export const SECTIONS = [
  { id: "hero",                label: "Giriş", labelShort: "Giriş" },
  { id: "marquee",             label: "Topluluk", labelShort: "Topluluk" },
  { id: "vsl",                 label: "Tanıtım", labelShort: "Tanıtım" },
  { id: "karsilastirma",       label: "Karşılaştırma", labelShort: "Kıyas" },
  { id: "video-testimonials",  label: "Öğrenci Yorumları", labelShort: "Yorumlar" },
  { id: "outcomes",            label: "Sonuçlar", labelShort: "Sonuçlar" },
  { id: "content",             label: "İçerik", labelShort: "İçerik" },
  { id: "muzik-programi",      label: "Müzik Programı", labelShort: "Program" },
  { id: "instructor",          label: "Eğitmen", labelShort: "Eğitmen" },
  { id: "faq",                 label: "Sıkça Sorulanlar", labelShort: "SSS" },
  { id: "basvur",              label: "Başvuru", labelShort: "Başvuru" },
];

export function useActiveSection() {
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const activeIndex = SECTIONS.findIndex(s => s.id === activeId);

  return { activeId, activeIndex, sections: SECTIONS };
}
