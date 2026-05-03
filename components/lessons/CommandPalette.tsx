"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { useLessonShell } from "./LessonShellContext";
import { flatLessons, type SampleLesson, type SampleModule } from "@/lib/sample-curriculum";
import { useDialogA11y, useIsMounted } from "./useDialogA11y";

type Result = { lesson: SampleLesson; module: SampleModule };

export default function CommandPalette() {
  const router = useRouter();
  const { course, commandPaletteOpen, setCommandPaletteOpen } = useLessonShell();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mounted = useIsMounted();

  const allLessons = useMemo(() => flatLessons(course), [course]);

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return allLessons.slice(0, 8);
    return allLessons.filter(({ lesson, module }) => {
      const hay = `${module.title} ${lesson.number} ${lesson.title}`.toLowerCase();
      return term.split(/\s+/).every((part) => hay.includes(part));
    });
  }, [q, allLessons]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQ("");
      setActive(0);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  const onClose = useCallback(
    () => setCommandPaletteOpen(false),
    [setCommandPaletteOpen]
  );

  useDialogA11y(dialogRef, {
    open: commandPaletteOpen,
    onClose,
    initialFocusRef: inputRef
  });

  const go = useCallback(
    (r: Result | undefined) => {
      if (!r) return;
      if (r.lesson.status === "locked") return;
      router.push(`/lessons/${course.slug}/${r.lesson.slug}`);
      setCommandPaletteOpen(false);
    },
    [router, course.slug, setCommandPaletteOpen]
  );

  if (!mounted || !commandPaletteOpen) return null;

  const activeOptionId = results[active]
    ? `lessons-cmd-opt-${results[active].lesson.slug}`
    : undefined;

  const tree = (
    <div
      className="lessons-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Derslerde ara"
        className="lessons-cmd"
      >
        <header className="lessons-cmd__header">
          <Search size={16} className="lessons-cmd__icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ders ara… (örn: ritm, mızrak, bas)"
            className="lessons-cmd__input"
            role="combobox"
            aria-controls="lessons-cmd-listbox"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-activedescendant={activeOptionId}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(results.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(results[active]);
              }
            }}
          />
          <kbd className="lessons-kbd">Esc</kbd>
        </header>
        <ul
          id="lessons-cmd-listbox"
          className="lessons-cmd__list"
          role="listbox"
          aria-label="Sonuçlar"
        >
          {results.length === 0 && (
            <li className="lessons-cmd__empty">
              Eşleşen ders yok. Başka bir kelime dene.
            </li>
          )}
          {results.map((r, i) => {
            const locked = r.lesson.status === "locked";
            return (
              <li
                key={r.lesson.id}
                id={`lessons-cmd-opt-${r.lesson.slug}`}
                role="option"
                aria-selected={active === i}
                aria-disabled={locked || undefined}
                className={[
                  "lessons-cmd__item",
                  active === i ? "is-active" : "",
                  locked ? "is-locked" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
              >
                <span className="lessons-cmd__num">D{r.lesson.number}</span>
                <span className="lessons-cmd__title">{r.lesson.title}</span>
                <span className="lessons-cmd__module">
                  Modül {r.module.number} · {r.module.title}
                </span>
                {active === i && (
                  <CornerDownLeft
                    size={12}
                    className="lessons-cmd__enter"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ul>
        <footer className="lessons-cmd__footer">
          <span>
            <kbd className="lessons-kbd">↑↓</kbd> seç
          </span>
          <span>
            <kbd className="lessons-kbd">↵</kbd> aç
          </span>
          <span>
            <kbd className="lessons-kbd">Esc</kbd> kapat
          </span>
        </footer>
      </div>
    </div>
  );

  return createPortal(tree, document.body);
}
