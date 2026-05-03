"use client";

import { useMemo, useState } from "react";
import { ChevronsLeft, ChevronsRight, BookMarked, Star } from "lucide-react";
import { useLessonShell } from "./LessonShellContext";
import ModuleHeader from "./ModuleHeader";
import LessonRow from "./LessonRow";
import CurriculumSearchInput from "./CurriculumSearchInput";

export default function CurriculumSidebar() {
  const {
    course,
    module: currentModule,
    lesson: currentLesson,
    curriculumCollapsed,
    setCurriculumCollapsed,
    focusMode,
    toggleFocusMode,
    bookmarkFilter,
    setBookmarkFilter,
    bookmarks,
    completed,
    lastVisited,
    toggleBookmark
  } = useLessonShell();

  const effectiveCollapsed = curriculumCollapsed || focusMode;

  const [filter, setFilter] = useState("");
  const [openModules, setOpenModules] = useState<Set<string>>(
    () => new Set([currentModule.id])
  );

  const toggleModule = (id: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredModules = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return course.modules.map((m) => {
      const lessons = m.lessons.filter((l) => {
        if (bookmarkFilter && !bookmarks.has(l.id)) return false;
        if (!q) return true;
        return (
          l.title.toLowerCase().includes(q) ||
          l.number.includes(q) ||
          m.title.toLowerCase().includes(q)
        );
      });
      return { module: m, lessons };
    });
  }, [course, filter, bookmarkFilter, bookmarks]);

  if (effectiveCollapsed) {
    const handleOpen = () => {
      if (focusMode) toggleFocusMode();
      else setCurriculumCollapsed(false);
    };
    return (
      <aside className="lessons-rail lessons-rail--left" aria-label="Müfredat (kapalı)">
        <button
          type="button"
          className="lessons-rail__toggle"
          onClick={handleOpen}
          aria-expanded={false}
          aria-label="Müfredatı aç"
          title="Müfredatı aç"
        >
          <ChevronsRight size={18} />
        </button>
        <div className="lessons-rail__label" aria-hidden="true">MÜFREDAT</div>
        <div className="lessons-rail__icons" aria-hidden="true">
          <BookMarked size={18} />
          {bookmarks.size > 0 && (
            <span className="lessons-rail__badge">{bookmarks.size}</span>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className="lessons-sidebar lessons-sidebar--left" aria-label="Müfredat">
      <header className="lessons-sidebar__header">
        <div className="lessons-sidebar__title-row">
          <span className="lessons-sidebar__eyebrow">MÜFREDAT</span>
          <button
            type="button"
            className="lessons-sidebar__close"
            onClick={() => setCurriculumCollapsed(true)}
            aria-expanded={true}
            aria-label="Müfredatı kapat"
            title="Müfredatı kapat"
          >
            <ChevronsLeft size={16} />
          </button>
        </div>
        <h2 className="lessons-sidebar__course-title">{course.title}</h2>
      </header>

      <div className="lessons-sidebar__controls">
        <CurriculumSearchInput value={filter} onChange={setFilter} />
        <button
          type="button"
          className={[
            "lessons-bookmark-toggle",
            bookmarkFilter ? "is-on" : ""
          ].filter(Boolean).join(" ")}
          onClick={() => setBookmarkFilter(!bookmarkFilter)}
          aria-pressed={bookmarkFilter}
          title="Yer imlerini göster"
        >
          <Star size={14} />
          <span>Yer İmleri</span>
          {bookmarks.size > 0 && (
            <span className="lessons-bookmark-toggle__count">{bookmarks.size}</span>
          )}
        </button>
      </div>

      <nav className="lessons-sidebar__scroll" aria-label="Modüller">
        {filteredModules.map(({ module: m, lessons }) => {
          if (lessons.length === 0 && (filter || bookmarkFilter)) return null;
          const isOpen = openModules.has(m.id);
          const completedCount = m.lessons.filter(
            (l) => l.status === "completed"
          ).length;
          return (
            <div key={m.id} className="lessons-module">
              <ModuleHeader
                module={m}
                isOpen={isOpen}
                onToggle={() => toggleModule(m.id)}
                completedCount={completedCount}
              />
              {isOpen && (
                <ul className="lessons-module__list">
                  {lessons.map((l) => {
                    const isCurrent = currentLesson.slug === l.slug;
                    return (
                      <li key={l.id}>
                        <LessonRow
                          lesson={l}
                          courseSlug={course.slug}
                          moduleSlug={m.slug}
                          isCurrent={isCurrent}
                          isResume={lastVisited === l.slug && !isCurrent}
                          isCompleted={completed.has(l.id)}
                          isBookmarked={bookmarks.has(l.id)}
                          onToggleBookmark={toggleBookmark}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
