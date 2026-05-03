"use client";

import { Target } from "lucide-react";
import { useLessonShell } from "./LessonShellContext";

export default function LessonObjectives() {
  const { lesson } = useLessonShell();
  if (!lesson.objectives || lesson.objectives.length === 0) return null;

  return (
    <section className="lessons-objectives" aria-labelledby="lessons-objectives-title">
      <header className="lessons-objectives__header">
        <Target size={14} className="lessons-objectives__icon" aria-hidden="true" />
        <h2 id="lessons-objectives-title" className="lessons-objectives__title">
          Bu derste öğreneceğin
        </h2>
      </header>
      <ul className="lessons-objectives__list">
        {lesson.objectives.map((o, i) => (
          <li key={i} className="lessons-objectives__item">
            <span className="lessons-objectives__bullet" aria-hidden="true" />
            <span>{o}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
