"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLessonShell } from "./LessonShellContext";
import { getAdjacentLessons } from "@/lib/sample-curriculum";
import CompleteLessonPopover from "./CompleteLessonPopover";

export default function LessonFooterNav() {
  const router = useRouter();
  const {
    course,
    lesson,
    completed,
    markCompleted,
    completePopoverOpen,
    setCompletePopoverOpen
  } = useLessonShell();
  const { prev, next } = getAdjacentLessons(course, lesson.slug);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isCompleted = completed.has(lesson.id);

  const handleConfirm = () => {
    markCompleted(lesson.id);
    setCompletePopoverOpen(false);
    if (next) {
      router.push(`/lessons/${course.slug}/${next.slug}`);
    }
  };

  return (
    <nav className="lessons-footer-nav" aria-label="Ders gezinme">
      <div className="lessons-footer-nav__side">
        {prev ? (
          <Link
            href={`/lessons/${course.slug}/${prev.slug}`}
            className="lessons-btn lessons-btn--ghost"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span className="lessons-btn__label">Önceki</span>
            <span className="lessons-btn__sub">{prev.number} · {prev.title}</span>
          </Link>
        ) : (
          <span className="lessons-btn lessons-btn--ghost lessons-btn--disabled" aria-disabled="true">
            <ArrowLeft size={14} aria-hidden="true" />
            <span className="lessons-btn__label">Başlangıç</span>
          </span>
        )}
      </div>

      <div className="lessons-footer-nav__center">
        <div className="lessons-complete-wrap">
          <button
            ref={triggerRef}
            type="button"
            className={[
              "lessons-btn lessons-btn--complete",
              isCompleted ? "is-done" : ""
            ].filter(Boolean).join(" ")}
            onClick={() => setCompletePopoverOpen(!completePopoverOpen)}
            aria-haspopup="dialog"
            aria-expanded={completePopoverOpen}
          >
            <Check size={14} aria-hidden="true" />
            <span>{isCompleted ? "Tamamlandı" : "Bu dersi tamamla"}</span>
          </button>
          {completePopoverOpen && (
            <CompleteLessonPopover
              triggerRef={triggerRef}
              statements={lesson.selfAssessment}
              onConfirm={handleConfirm}
              onClose={() => setCompletePopoverOpen(false)}
            />
          )}
        </div>
      </div>

      <div className="lessons-footer-nav__side lessons-footer-nav__side--right">
        {next ? (
          <Link
            href={`/lessons/${course.slug}/${next.slug}`}
            className="lessons-btn lessons-btn--ghost"
          >
            <span className="lessons-btn__label">Sonraki</span>
            <span className="lessons-btn__sub">{next.number} · {next.title}</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        ) : (
          <span className="lessons-btn lessons-btn--ghost lessons-btn--disabled" aria-disabled="true">
            <span className="lessons-btn__label">Son ders</span>
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
