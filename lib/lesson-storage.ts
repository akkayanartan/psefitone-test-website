"use client";

const PREFIX = "psf";
const isClient = () => typeof window !== "undefined";

function safeGet(key: string): string | null {
  if (!isClient()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* quota exceeded or disabled */
  }
}

function safeRemove(key: string) {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const storageKeys = {
  curriculumCollapsed: `${PREFIX}:curriculum:collapsed`,
  notesCollapsed: `${PREFIX}:notes:collapsed`,
  lastVisited: `${PREFIX}:last-visited`,
  bookmarks: `${PREFIX}:bookmarks`,
  completed: `${PREFIX}:completed`,
  pinnedNotes: `${PREFIX}:pinned-notes`,
  noteFor: (lessonSlug: string) => `${PREFIX}:note:${lessonSlug}`
};

export const lessonStorage = {
  getCollapse(side: "curriculum" | "notes"): boolean {
    const key =
      side === "curriculum"
        ? storageKeys.curriculumCollapsed
        : storageKeys.notesCollapsed;
    return safeGet(key) === "1";
  },
  setCollapse(side: "curriculum" | "notes", collapsed: boolean) {
    const key =
      side === "curriculum"
        ? storageKeys.curriculumCollapsed
        : storageKeys.notesCollapsed;
    safeSet(key, collapsed ? "1" : "0");
  },

  getLastVisited(): string | null {
    return safeGet(storageKeys.lastVisited);
  },
  setLastVisited(lessonSlug: string) {
    safeSet(storageKeys.lastVisited, lessonSlug);
  },

  getStringSet(key: string): Set<string> {
    const raw = safeGet(key);
    if (!raw) return new Set();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed.filter((x) => typeof x === "string"));
      return new Set();
    } catch {
      return new Set();
    }
  },
  setStringSet(key: string, set: Set<string>) {
    safeSet(key, JSON.stringify(Array.from(set)));
  },

  getBookmarks(): Set<string> {
    return this.getStringSet(storageKeys.bookmarks);
  },
  toggleBookmark(lessonId: string): boolean {
    const set = this.getBookmarks();
    const next = !set.has(lessonId);
    if (next) set.add(lessonId);
    else set.delete(lessonId);
    this.setStringSet(storageKeys.bookmarks, set);
    return next;
  },

  getCompleted(): Set<string> {
    return this.getStringSet(storageKeys.completed);
  },
  markCompleted(lessonId: string) {
    const set = this.getCompleted();
    set.add(lessonId);
    this.setStringSet(storageKeys.completed, set);
  },

  getPinnedNotes(): Set<string> {
    return this.getStringSet(storageKeys.pinnedNotes);
  },
  togglePinnedNote(lessonSlug: string): boolean {
    const set = this.getPinnedNotes();
    const next = !set.has(lessonSlug);
    if (next) set.add(lessonSlug);
    else set.delete(lessonSlug);
    this.setStringSet(storageKeys.pinnedNotes, set);
    return next;
  },

  getNote(lessonSlug: string): string {
    return safeGet(storageKeys.noteFor(lessonSlug)) ?? "";
  },
  setNote(lessonSlug: string, value: string) {
    if (value.trim().length === 0) {
      safeRemove(storageKeys.noteFor(lessonSlug));
      return;
    }
    safeSet(storageKeys.noteFor(lessonSlug), value);
  },
  getAllNotes(allSlugs: string[]): { slug: string; text: string }[] {
    if (!isClient()) return [];
    return allSlugs
      .map((slug) => ({ slug, text: this.getNote(slug) }))
      .filter((n) => n.text.length > 0);
  }
};
