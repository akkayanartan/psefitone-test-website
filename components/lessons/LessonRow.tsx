"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { Check, Lock, Star, Circle } from "lucide-react";
import type { SampleLesson, Difficulty } from "@/lib/sample-curriculum";

interface Props {
  lesson: SampleLesson;
  courseSlug: string;
  moduleSlug: string;
  isCurrent: boolean;
  isResume: boolean;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (lessonId: string) => void;
}

const difficultyGlyph: Record<Difficulty, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  master: "💠"
};

const difficultyLabel: Record<Difficulty, string> = {
  bronze: "Bronz",
  silver: "Gümüş",
  gold: "Altın",
  master: "Usta"
};

function LessonRowImpl({
  lesson,
  courseSlug,
  isCurrent,
  isResume,
  isCompleted,
  isBookmarked,
  onToggleBookmark
}: Props) {
  const isLocked = lesson.status === "locked";

  const status = isLocked
    ? "locked"
    : isCompleted
    ? "completed"
    : isCurrent
    ? "current"
    : "available";

  const handleBookmark = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleBookmark(lesson.id);
    },
    [lesson.id, onToggleBookmark]
  );

  if (isLocked) {
    return (
      <div
        className="lessons-row lessons-row--locked"
        aria-disabled="true"
        title="Bu ders henüz kilitli"
      >
        <span className="sr-only">Kilitli ders. </span>
        <span className="lessons-row__status" aria-hidden="true">
          <Lock size={12} />
        </span>
        <span className="lessons-row__num">{lesson.number}</span>
        <span className="lessons-row__title">{lesson.title}</span>
        <span
          className="lessons-row__difficulty"
          title={difficultyLabel[lesson.difficulty]}
          aria-label={difficultyLabel[lesson.difficulty]}
        >
          {difficultyGlyph[lesson.difficulty]}
        </span>
        <span className="lessons-row__duration">{lesson.durationMin}dk</span>
      </div>
    );
  }

  return (
    <Link
      href={`/lessons/${courseSlug}/${lesson.slug}`}
      className={[
        "lessons-row",
        isCurrent ? "lessons-row--current" : "",
        isCompleted ? "lessons-row--completed" : "",
        isResume ? "lessons-row--resume" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      aria-current={isCurrent ? "page" : undefined}
    >
      {isCurrent && <span className="lessons-row__active-bar" aria-hidden="true" />}
      <span className="lessons-row__status" aria-hidden="true">
        {status === "completed" && <Check size={14} className="lessons-row__check" />}
        {status === "current" && (
          <Circle size={10} className="lessons-row__current-dot" fill="currentColor" />
        )}
        {status === "available" && <span className="lessons-row__dot" />}
      </span>
      <span className="lessons-row__num">{lesson.number}</span>
      <span className="lessons-row__title">{lesson.title}</span>
      <span
        className="lessons-row__difficulty"
        title={difficultyLabel[lesson.difficulty]}
        aria-label={difficultyLabel[lesson.difficulty]}
      >
        {difficultyGlyph[lesson.difficulty]}
      </span>
      <span className="lessons-row__duration">{lesson.durationMin}dk</span>
      <button
        type="button"
        className={[
          "lessons-row__bookmark",
          isBookmarked ? "is-on" : ""
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleBookmark}
        aria-pressed={isBookmarked}
        aria-label={isBookmarked ? "Yer imini kaldır" : "Yer imine ekle"}
        title={isBookmarked ? "Yer imini kaldır" : "Yer imine ekle"}
      >
        <Star size={13} fill={isBookmarked ? "currentColor" : "none"} />
      </button>
      {isResume && <span className="lessons-row__halo" aria-hidden="true" />}
    </Link>
  );
}

const LessonRow = memo(LessonRowImpl);
export default LessonRow;
