"use client";

import { Flame } from "lucide-react";

interface Props {
  days: number;
}

export default function StreakChip({ days }: Props) {
  return (
    <div
      className="lessons-streak-chip"
      title={`${days} günlük seri. Bugün de bir ders bitir.`}
      aria-label={`Çalışma serisi: ${days} gün`}
    >
      <Flame size={13} className="lessons-streak-chip__icon" aria-hidden="true" />
      <span className="lessons-streak-chip__num">{days}</span>
      <span className="lessons-streak-chip__unit">gün</span>
    </div>
  );
}
