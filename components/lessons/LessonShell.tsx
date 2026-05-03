"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  flatLessons,
  getAdjacentLessons,
  type SampleCourse,
  type SampleLesson,
  type SampleModule
} from "@/lib/sample-curriculum";
import { lessonStorage } from "@/lib/lesson-storage";
import { LessonShellProvider } from "./LessonShellContext";
import LessonTopBar from "./LessonTopBar";
import CurriculumSidebar from "./CurriculumSidebar";
import NotesSidebar from "./NotesSidebar";
import LessonObjectives from "./LessonObjectives";
import LessonCanvas from "./LessonCanvas";
import LessonHeader from "./LessonHeader";
import LessonTabs from "./LessonTabs";
import LessonFooterNav from "./LessonFooterNav";
import CommandPalette from "./CommandPalette";
import KeyboardShortcutsDialog from "./KeyboardShortcutsDialog";

interface Props {
  course: SampleCourse;
  module: SampleModule;
  lesson: SampleLesson;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export default function LessonShell({ course, module: mod, lesson }: Props) {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [curriculumCollapsed, setCurriculumCollapsedState] = useState(false);
  const [notesCollapsed, setNotesCollapsedState] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [completePopoverOpen, setCompletePopoverOpen] = useState(false);
  const [bookmarkFilter, setBookmarkFilter] = useState(false);

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [pinnedNotes, setPinnedNotes] = useState<Set<string>>(new Set());
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    setCurriculumCollapsedState(lessonStorage.getCollapse("curriculum"));
    setNotesCollapsedState(lessonStorage.getCollapse("notes"));
    const initialBookmarks = lessonStorage.getBookmarks();
    course.modules.forEach((m) =>
      m.lessons.forEach((l) => {
        if (l.bookmarked) initialBookmarks.add(l.id);
      })
    );
    setBookmarks(initialBookmarks);

    const initialCompleted = lessonStorage.getCompleted();
    course.modules.forEach((m) =>
      m.lessons.forEach((l) => {
        if (l.status === "completed") initialCompleted.add(l.id);
      })
    );
    setCompleted(initialCompleted);

    setPinnedNotes(lessonStorage.getPinnedNotes());
    setLastVisited(lessonStorage.getLastVisited());
    setHydrated(true);
  }, [course]);

  // Record last-visited
  useEffect(() => {
    lessonStorage.setLastVisited(lesson.slug);
    setLastVisited(lesson.slug);
  }, [lesson.slug]);

  const setCurriculumCollapsed = useCallback((v: boolean) => {
    setCurriculumCollapsedState(v);
    lessonStorage.setCollapse("curriculum", v);
  }, []);

  const setNotesCollapsed = useCallback((v: boolean) => {
    setNotesCollapsedState(v);
    lessonStorage.setCollapse("notes", v);
  }, []);

  const toggleFocusMode = useCallback(() => setFocusMode((v) => !v), []);

  const toggleBookmark = useCallback((lessonId: string) => {
    const isOn = lessonStorage.toggleBookmark(lessonId);
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (isOn) next.add(lessonId);
      else next.delete(lessonId);
      return next;
    });
  }, []);

  const markCompleted = useCallback((lessonId: string) => {
    lessonStorage.markCompleted(lessonId);
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(lessonId);
      return next;
    });
  }, []);

  const togglePinnedNote = useCallback((lessonSlug: string) => {
    const isOn = lessonStorage.togglePinnedNote(lessonSlug);
    setPinnedNotes((prev) => {
      const next = new Set(prev);
      if (isOn) next.add(lessonSlug);
      else next.delete(lessonSlug);
      return next;
    });
  }, []);

  // Adjacent lessons for keyboard arrows
  const { prev, next } = useMemo(
    () => getAdjacentLessons(course, lesson.slug),
    [course, lesson.slug]
  );

  // Global keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = isTypingTarget(e.target);
      const modalOpen =
        commandPaletteOpen || shortcutsOpen || completePopoverOpen;

      // ⌘K / Ctrl+K — always works (also closes the palette if open)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((v) => !v);
        return;
      }
      // While a modal is open, the modal's own a11y hook owns Escape and Tab.
      // We must not let global F / ? / Arrow shortcuts fire underneath.
      if (modalOpen) return;
      if (typing) return;

      // F = focus mode
      if (e.key.toLowerCase() === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleFocusMode();
        return;
      }
      // ? = shortcuts
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
        return;
      }
      // Arrow nav between lessons
      if (e.key === "ArrowLeft" && prev) {
        e.preventDefault();
        router.push(`/lessons/${course.slug}/${prev.slug}`);
        return;
      }
      if (e.key === "ArrowRight" && next) {
        e.preventDefault();
        router.push(`/lessons/${course.slug}/${next.slug}`);
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    commandPaletteOpen,
    shortcutsOpen,
    completePopoverOpen,
    toggleFocusMode,
    prev,
    next,
    course.slug,
    router
  ]);

  const totalLessons = useMemo(() => flatLessons(course).length, [course]);

  const value = useMemo(
    () => ({
      course,
      module: mod,
      lesson,
      hydrated,
      curriculumCollapsed,
      notesCollapsed,
      focusMode,
      commandPaletteOpen,
      shortcutsOpen,
      completePopoverOpen,
      bookmarkFilter,
      bookmarks,
      completed,
      pinnedNotes,
      lastVisited,
      setCurriculumCollapsed,
      setNotesCollapsed,
      toggleFocusMode,
      setCommandPaletteOpen,
      setShortcutsOpen,
      setCompletePopoverOpen,
      setBookmarkFilter,
      toggleBookmark,
      markCompleted,
      togglePinnedNote
    }),
    [
      course,
      mod,
      lesson,
      hydrated,
      curriculumCollapsed,
      notesCollapsed,
      focusMode,
      commandPaletteOpen,
      shortcutsOpen,
      completePopoverOpen,
      bookmarkFilter,
      bookmarks,
      completed,
      pinnedNotes,
      lastVisited,
      setCurriculumCollapsed,
      setNotesCollapsed,
      toggleFocusMode,
      toggleBookmark,
      markCompleted,
      togglePinnedNote
    ]
  );

  const anyModalOpen =
    commandPaletteOpen || shortcutsOpen || completePopoverOpen;

  return (
    <LessonShellProvider value={value}>
      {/* Mobile fallback */}
      <div className="lessons-mobile-fallback">
        <div className="lessons-mobile-card">
          <h1>Ders kütüphanesi şimdilik masaüstü için.</h1>
          <p>Mobil çok yakında. Şimdilik bilgisayarından devam et.</p>
          <a href="/" className="lessons-mobile-link">Ana sayfaya dön</a>
        </div>
      </div>

      {/* Desktop shell — marked inert while a modal is open so focus/AT can't leak behind */}
      <div
        className={[
          "lessons-shell",
          (curriculumCollapsed || focusMode) ? "lessons-shell--left-collapsed" : "",
          (notesCollapsed || focusMode) ? "lessons-shell--right-collapsed" : "",
          focusMode ? "lessons-shell--focus" : ""
        ]
          .filter(Boolean)
          .join(" ")}
        data-completed={completed.size}
        data-total={totalLessons}
        inert={anyModalOpen || undefined}
        aria-hidden={anyModalOpen || undefined}
      >
        <LessonTopBar />
        <CurriculumSidebar />

        <section className="lessons-center" aria-label="Ders içeriği">
          <div className="lessons-center__inner">
            <h1 className="sr-only">{lesson.title}</h1>
            <LessonObjectives />
            <LessonCanvas />
            <LessonHeader />
            <LessonTabs />
            <LessonFooterNav />
          </div>
        </section>

        <NotesSidebar />
      </div>

      <CommandPalette />
      <KeyboardShortcutsDialog />
    </LessonShellProvider>
  );
}
