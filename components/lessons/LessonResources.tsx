"use client";

import { FileText, Music, FileAudio, Film, Download } from "lucide-react";
import type { SampleResource, ResourceType } from "@/lib/sample-curriculum";

const resourceIcon: Record<ResourceType, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  pdf: FileText,
  audio: FileAudio,
  midi: Music,
  video: Film
};

const resourceLabel: Record<ResourceType, string> = {
  pdf: "PDF",
  audio: "Ses",
  midi: "MIDI",
  video: "Video"
};

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

interface Props {
  resources: SampleResource[];
}

export default function LessonResources({ resources }: Props) {
  if (resources.length === 0) {
    return (
      <p className="lessons-resources__empty">
        Bu derse henüz kaynak eklenmedi.
      </p>
    );
  }

  return (
    <ul className="lessons-resources">
      {resources.map((r, i) => {
        const Icon = resourceIcon[r.type];
        return (
          <li key={i} className="lessons-resources__item">
            <span className={`lessons-resources__icon lessons-resources__icon--${r.type}`} aria-hidden="true">
              <Icon size={16} />
            </span>
            <div className="lessons-resources__info">
              <span className="lessons-resources__name">{r.name}</span>
              <span className="lessons-resources__meta">
                {resourceLabel[r.type]} · {formatSize(r.sizeKB)}
              </span>
            </div>
            <button
              type="button"
              className="lessons-resources__action"
              aria-label={`İndir: ${r.name}`}
              title="İndir (yakında)"
            >
              <Download size={14} aria-hidden="true" />
              <span>İndir</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
