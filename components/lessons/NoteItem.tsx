"use client";

import Link from "next/link";
import { Pin } from "lucide-react";

interface Props {
  courseSlug: string;
  lessonSlug: string;
  lessonNumber: string;
  lessonTitle: string;
  moduleNumber: number;
  snippet: string;
  pinned: boolean;
  onTogglePin: () => void;
}

export default function NoteItem({
  courseSlug,
  lessonSlug,
  lessonNumber,
  lessonTitle,
  moduleNumber,
  snippet,
  pinned,
  onTogglePin
}: Props) {
  const trimmed = snippet.length > 140 ? snippet.slice(0, 140).trim() + "…" : snippet;
  return (
    <article className={["lessons-note-item", pinned ? "is-pinned" : ""].filter(Boolean).join(" ")}>
      <header className="lessons-note-item__header">
        <Link
          href={`/lessons/${courseSlug}/${lessonSlug}`}
          className="lessons-note-item__link"
        >
          <span className="lessons-note-item__crumb">
            M{moduleNumber} · D{lessonNumber}
          </span>
          <span className="lessons-note-item__title">{lessonTitle}</span>
        </Link>
        <button
          type="button"
          className={[
            "lessons-note-item__pin",
            pinned ? "is-on" : ""
          ].filter(Boolean).join(" ")}
          onClick={onTogglePin}
          aria-pressed={pinned}
          aria-label={pinned ? "Sabitlemeyi kaldır" : "Notu sabitle"}
          title={pinned ? "Sabitlemeyi kaldır" : "Notu sabitle"}
        >
          <Pin size={11} aria-hidden="true" />
        </button>
      </header>
      <p className="lessons-note-item__snippet">{trimmed}</p>
    </article>
  );
}
