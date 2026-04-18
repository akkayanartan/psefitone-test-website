"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

export default function SectionTracker() {
  useEffect(() => {
    const fired = new Set<string>();
    const sections = document.querySelectorAll<HTMLElement>(
      "main section[id]"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.has(entry.target.id)) {
            fired.add(entry.target.id);
            track("section_view", { section: entry.target.id });
          }
        }
      },
      { threshold: 0.25 }
    );
    sections.forEach((el) => observer.observe(el));

    const depthMarks = [25, 50, 75, 100] as const;
    const firedDepths = new Set<number>();
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total <= 0) return;
      const pct = Math.round((scrolled / total) * 100);
      for (const mark of depthMarks) {
        if (pct >= mark && !firedDepths.has(mark)) {
          firedDepths.add(mark);
          track("scroll_depth", { depth: mark });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
