"use client";

interface Props {
  completedCount: number;
  total: number;
}

export default function CourseProgressRing({ completedCount, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const r = 11;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div
      className="lessons-progress-ring"
      role="img"
      aria-label={`Kurs ilerleme: %${pct}, ${completedCount} / ${total} ders tamamlandı`}
      title={`%${pct} tamamlandı (${completedCount}/${total})`}
    >
      <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
        <circle
          cx="14"
          cy="14"
          r={r}
          fill="none"
          stroke="var(--brand-border)"
          strokeWidth="2"
        />
        <circle
          cx="14"
          cy="14"
          r={r}
          fill="none"
          stroke="url(#lessons-progress-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 14 14)"
        />
        <defs>
          <linearGradient id="lessons-progress-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-secondary)" />
            <stop offset="100%" stopColor="var(--brand-primary)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="lessons-progress-ring__pct">%{pct}</span>
    </div>
  );
}
