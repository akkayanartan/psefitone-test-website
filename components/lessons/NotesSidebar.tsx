"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  StickyNote,
  Pin,
  Clock3
} from "lucide-react";
import { useLessonShell } from "./LessonShellContext";
import { lessonStorage } from "@/lib/lesson-storage";
import { flatLessons } from "@/lib/sample-curriculum";
import NoteItem from "./NoteItem";

type View = "current" | "all";
type SaveStatus = "idle" | "saving" | "saved";

function fmtTime(d: Date) {
  return d
    .toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", ".");
}

export default function NotesSidebar() {
  const {
    lesson,
    course,
    notesCollapsed,
    setNotesCollapsed,
    focusMode,
    toggleFocusMode,
    pinnedNotes,
    togglePinnedNote,
    hydrated
  } = useLessonShell();

  const effectiveCollapsed = notesCollapsed || focusMode;

  const [view, setView] = useState<View>("current");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initRef = useRef(false);
  const slugRef = useRef(lesson.slug);
  const latestRef = useRef({ slug: lesson.slug, text: "" });

  // Keep latestRef in sync each render — used by the unmount flush effect.
  latestRef.current = { slug: lesson.slug, text };

  // Load note for current lesson — reset init flag on every slug change so
  // the save effect below can't fire with the previous lesson's text under
  // the new lesson's slug.
  useEffect(() => {
    if (!hydrated) return;
    initRef.current = false;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    slugRef.current = lesson.slug;
    const v = lessonStorage.getNote(lesson.slug);
    setText(v);
    setStatus(v ? "saved" : "idle");
    setSavedAt(v ? new Date() : null);
    // Mark loaded after the state settles so the save-effect re-run for
    // this new text/slug pair sees init=true only after `text` reflects
    // the loaded value.
    queueMicrotask(() => {
      initRef.current = true;
    });
  }, [lesson.slug, hydrated]);

  // Debounced autosave — captures slug in closure and refuses to write
  // if the slug has since changed (stale debounce from previous lesson).
  useEffect(() => {
    if (!hydrated || !initRef.current) return;
    if (slugRef.current !== lesson.slug) return;
    const slug = lesson.slug;
    const value = text;
    setStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (slugRef.current !== slug) return;
      lessonStorage.setNote(slug, value);
      setStatus("saved");
      setSavedAt(new Date());
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text, lesson.slug, hydrated]);

  // Flush any pending save on unmount — covers a fast nav before debounce fires.
  useEffect(() => {
    return () => {
      if (!initRef.current) return;
      const { slug, text: latestText } = latestRef.current;
      lessonStorage.setNote(slug, latestText);
    };
  }, []);

  const allLessons = useMemo(() => flatLessons(course), [course]);

  const allNotes = useMemo(() => {
    if (!hydrated) return [];
    const slugs = allLessons.map((x) => x.lesson.slug);
    const notes = lessonStorage.getAllNotes(slugs);
    return notes
      .map((n) => {
        const ref = allLessons.find((x) => x.lesson.slug === n.slug);
        return ref ? { ...n, lesson: ref.lesson, module: ref.module } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => {
        const ap = pinnedNotes.has(a.slug) ? 0 : 1;
        const bp = pinnedNotes.has(b.slug) ? 0 : 1;
        if (ap !== bp) return ap - bp;
        return a.lesson.number.localeCompare(b.lesson.number);
      });
  }, [allLessons, pinnedNotes, hydrated, text, lesson.slug]);

  if (effectiveCollapsed) {
    const handleOpen = () => {
      if (focusMode) toggleFocusMode();
      else setNotesCollapsed(false);
    };
    return (
      <aside className="lessons-rail lessons-rail--right" aria-label="Notlar (kapalı)">
        <button
          type="button"
          className="lessons-rail__toggle"
          onClick={handleOpen}
          aria-expanded={false}
          aria-label="Notları aç"
          title="Notları aç"
        >
          <ChevronsLeft size={18} />
        </button>
        <div className="lessons-rail__label" aria-hidden="true">NOTLARIM</div>
        <div className="lessons-rail__icons" aria-hidden="true">
          <StickyNote size={18} />
        </div>
      </aside>
    );
  }

  return (
    <aside className="lessons-sidebar lessons-sidebar--right" aria-label="Notlarım">
      <header className="lessons-sidebar__header">
        <div className="lessons-sidebar__title-row">
          <span className="lessons-sidebar__eyebrow">NOTLARIM</span>
          <button
            type="button"
            className="lessons-sidebar__close"
            onClick={() => setNotesCollapsed(true)}
            aria-expanded={true}
            aria-label="Notları kapat"
            title="Notları kapat"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
        <h2 className="lessons-sidebar__course-title lessons-sidebar__course-title--notes">
          {view === "current" ? `Ders ${lesson.number}` : "Tüm notlarım"}
        </h2>
      </header>

      <div className="lessons-notes__view-toggle" role="tablist" aria-label="Notlar görünümü">
        <button
          type="button"
          role="tab"
          aria-selected={view === "current"}
          className={[
            "lessons-notes__view-btn",
            view === "current" ? "is-active" : ""
          ].filter(Boolean).join(" ")}
          onClick={() => setView("current")}
        >
          Bu ders
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "all"}
          className={[
            "lessons-notes__view-btn",
            view === "all" ? "is-active" : ""
          ].filter(Boolean).join(" ")}
          onClick={() => setView("all")}
        >
          Tüm notlarım{allNotes.length > 0 && (
            <span className="lessons-notes__count">{allNotes.length}</span>
          )}
        </button>
      </div>

      {view === "current" ? (
        <div className="lessons-notes__editor">
          <div className="lessons-notes__toolbar">
            <button
              type="button"
              className="lessons-notes__ts-btn"
              disabled
              title="Player aktif olunca çalışacak"
              aria-label="Şu anki süreyi nota ekle (yakında)"
            >
              <Clock3 size={12} aria-hidden="true" />
              <span>@ Şimdi</span>
            </button>
            <button
              type="button"
              className={[
                "lessons-notes__pin-btn",
                pinnedNotes.has(lesson.slug) ? "is-on" : ""
              ].filter(Boolean).join(" ")}
              onClick={() => togglePinnedNote(lesson.slug)}
              aria-pressed={pinnedNotes.has(lesson.slug)}
              title={
                pinnedNotes.has(lesson.slug)
                  ? "Sabitlemeyi kaldır"
                  : "Bu notu sabitle"
              }
            >
              <Pin size={12} aria-hidden="true" />
              <span>{pinnedNotes.has(lesson.slug) ? "Sabit" : "Sabitle"}</span>
            </button>
          </div>
          <textarea
            className="lessons-notes__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bu derste aklında kalan ne varsa buraya yaz. Sağ el, sol el, tempo, hisler — ne olursa."
            aria-label={`Ders ${lesson.number} notları`}
            spellCheck={false}
          />
          <div className="lessons-notes__status" aria-live="polite">
            {status === "saving" && <span>Kaydediliyor…</span>}
            {status === "saved" && savedAt && (
              <span>Otomatik kaydedildi · {fmtTime(savedAt)}</span>
            )}
            {status === "idle" && (
              <span className="lessons-notes__status--muted">Yazmaya başla, otomatik kaydedilir.</span>
            )}
          </div>
        </div>
      ) : (
        <div className="lessons-notes__list">
          {allNotes.length === 0 ? (
            <p className="lessons-notes__empty">
              Henüz hiçbir derste not almadın. Bir ders aç, sağdaki kutuya yazmaya başla.
            </p>
          ) : (
            <ul className="lessons-notes__items">
              {allNotes.map((n) => (
                <li key={n.slug}>
                  <NoteItem
                    courseSlug={course.slug}
                    lessonSlug={n.slug}
                    lessonNumber={n.lesson.number}
                    lessonTitle={n.lesson.title}
                    moduleNumber={n.module.number}
                    snippet={n.text}
                    pinned={pinnedNotes.has(n.slug)}
                    onTogglePin={() => togglePinnedNote(n.slug)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}
