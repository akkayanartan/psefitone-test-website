"use client";

import { createContext, useContext } from "react";
import type { SampleCourse, SampleLesson, SampleModule } from "@/lib/sample-curriculum";

export interface LessonShellState {
  course: SampleCourse;
  module: SampleModule;
  lesson: SampleLesson;
  hydrated: boolean;

  curriculumCollapsed: boolean;
  notesCollapsed: boolean;
  focusMode: boolean;
  commandPaletteOpen: boolean;
  shortcutsOpen: boolean;
  completePopoverOpen: boolean;
  bookmarkFilter: boolean;

  bookmarks: Set<string>;
  completed: Set<string>;
  pinnedNotes: Set<string>;
  lastVisited: string | null;

  setCurriculumCollapsed: (v: boolean) => void;
  setNotesCollapsed: (v: boolean) => void;
  toggleFocusMode: () => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setShortcutsOpen: (v: boolean) => void;
  setCompletePopoverOpen: (v: boolean) => void;
  setBookmarkFilter: (v: boolean) => void;

  toggleBookmark: (lessonId: string) => void;
  markCompleted: (lessonId: string) => void;
  togglePinnedNote: (lessonSlug: string) => void;
}

const Ctx = createContext<LessonShellState | null>(null);

export const LessonShellProvider = Ctx.Provider;

export function useLessonShell(): LessonShellState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLessonShell must be used inside <LessonShellProvider>");
  return v;
}
