"use client";

import { Music2 } from "lucide-react";
import { useLessonShell } from "./LessonShellContext";

export default function LessonCanvas() {
  const { lesson, module: mod } = useLessonShell();
  return (
    <div className="lessons-canvas" role="region" aria-label="Ders oynatıcı alanı">
      <div className="lessons-canvas__glow" aria-hidden="true" />
      <div className="lessons-canvas__inner">
        <span className="lessons-canvas__eyebrow">MODÜL {mod.number} · DERS {lesson.number}</span>
        <p className="lessons-canvas__title" aria-hidden="true">{lesson.title}</p>
        <p className="lessons-canvas__sub">
          <Music2 size={14} aria-hidden="true" />
          <span>Tab + video oynatıcı yakında bu alanda olacak.</span>
        </p>
      </div>
    </div>
  );
}
