"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  Search,
  Maximize2,
  Minimize2,
  ChevronRight,
  User,
  HelpCircle
} from "lucide-react";
import { useLessonShell } from "./LessonShellContext";
import CourseProgressRing from "./CourseProgressRing";
import StreakChip from "./StreakChip";

export default function LessonTopBar() {
  const {
    course,
    module: mod,
    lesson,
    curriculumCollapsed,
    setCurriculumCollapsed,
    focusMode,
    toggleFocusMode,
    setCommandPaletteOpen,
    setShortcutsOpen,
    completed
  } = useLessonShell();

  return (
    <header className="lessons-topbar" role="banner">
      <div className="lessons-topbar__left">
        <button
          type="button"
          className="lessons-icon-btn"
          onClick={() => setCurriculumCollapsed(!curriculumCollapsed)}
          aria-label={curriculumCollapsed ? "Müfredatı aç" : "Müfredatı kapat"}
          aria-expanded={!curriculumCollapsed}
          title={curriculumCollapsed ? "Müfredatı aç" : "Müfredatı kapat"}
        >
          <Menu size={18} />
        </button>
        <Link href="/" className="lessons-topbar__logo" aria-label="Psefitone ana sayfa">
          <Image
            src="/square-logo.png"
            alt=""
            width={32}
            height={32}
            priority
          />
        </Link>
        <nav className="lessons-breadcrumb" aria-label="Konum">
          <span className="lessons-breadcrumb__item lessons-breadcrumb__item--brand">
            {course.shortTitle}
          </span>
          <ChevronRight size={12} className="lessons-breadcrumb__sep" aria-hidden="true" />
          <span className="lessons-breadcrumb__item">Modül {mod.number}</span>
          <ChevronRight size={12} className="lessons-breadcrumb__sep" aria-hidden="true" />
          <span className="lessons-breadcrumb__item lessons-breadcrumb__item--current">
            Ders {lesson.number}
          </span>
        </nav>
      </div>

      <div className="lessons-topbar__right">
        <button
          type="button"
          className="lessons-search-trigger"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Derslerde ara"
          title="Derslerde ara (⌘K)"
        >
          <Search size={14} />
          <span>Derslerde ara…</span>
          <kbd className="lessons-kbd">⌘K</kbd>
        </button>

        <StreakChip days={12} />

        <button
          type="button"
          className="lessons-icon-btn"
          onClick={toggleFocusMode}
          aria-pressed={focusMode}
          aria-label={focusMode ? "Odak modundan çık" : "Odak moduna gir"}
          title={focusMode ? "Odak modundan çık (F)" : "Odak modu (F)"}
        >
          {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <button
          type="button"
          className="lessons-icon-btn"
          onClick={() => setShortcutsOpen(true)}
          aria-label="Klavye kısayolları"
          title="Klavye kısayolları (?)"
        >
          <HelpCircle size={16} />
        </button>

        <CourseProgressRing
          completedCount={completed.size}
          total={course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
        />

        <button
          type="button"
          className="lessons-user-btn"
          aria-label="Kullanıcı menüsü"
          title="Kullanıcı menüsü (yakında)"
        >
          <User size={14} />
        </button>
      </div>
    </header>
  );
}
