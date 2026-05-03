"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import type { SampleModule } from "@/lib/sample-curriculum";

interface Props {
  module: SampleModule;
  isOpen: boolean;
  onToggle: () => void;
  completedCount: number;
}

export default function ModuleHeader({ module: m, isOpen, onToggle, completedCount }: Props) {
  const total = m.lessons.length;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <div className="lessons-module-header">
      <button
        type="button"
        className="lessons-module-header__btn"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="lessons-module-header__chev" aria-hidden="true">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <span className="lessons-module-header__num">Modül {m.number}</span>
        <span className="lessons-module-header__title">{m.title}</span>
      </button>
      <div className="lessons-module-header__progress" aria-label={`${pct}% tamamlandı`}>
        <div
          className="lessons-module-header__progress-fill"
          style={{ width: `${pct}%` }}
        />
        <span className="lessons-module-header__progress-text">
          {completedCount}/{total}
        </span>
      </div>
    </div>
  );
}
