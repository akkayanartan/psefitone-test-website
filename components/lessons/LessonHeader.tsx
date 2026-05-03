"use client";

import { Clock, Gauge } from "lucide-react";
import { useLessonShell } from "./LessonShellContext";
import type { Difficulty } from "@/lib/sample-curriculum";

const difficultyLabel: Record<Difficulty, string> = {
  bronze: "Bronz",
  silver: "Gümüş",
  gold: "Altın",
  master: "Usta"
};

const difficultyGlyph: Record<Difficulty, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  master: "💠"
};

export default function LessonHeader() {
  const { lesson } = useLessonShell();
  return (
    <header className="lessons-header">
      <div className="lessons-header__meta">
        <span className={`lessons-difficulty lessons-difficulty--${lesson.difficulty}`}>
          <span aria-hidden="true">{difficultyGlyph[lesson.difficulty]}</span>
          <span>{difficultyLabel[lesson.difficulty]}</span>
        </span>
        <span className="lessons-meta-chip">
          <Clock size={12} aria-hidden="true" />
          {lesson.durationMin} dk
        </span>
        <span className="lessons-meta-chip">
          <Gauge size={12} aria-hidden="true" />
          {lesson.bpm} BPM
        </span>
      </div>
    </header>
  );
}
