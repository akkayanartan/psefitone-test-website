"use client";

import { useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useLessonShell } from "./LessonShellContext";
import { useDialogA11y, useIsMounted } from "./useDialogA11y";

const shortcuts: { keys: string[]; desc: string; soon?: boolean }[] = [
  { keys: ["F"], desc: "Odak modu" },
  { keys: ["⌘", "K"], desc: "Derslerde ara" },
  { keys: ["?"], desc: "Bu pencereyi aç / kapat" },
  { keys: ["←"], desc: "Önceki ders" },
  { keys: ["→"], desc: "Sonraki ders" },
  { keys: ["Boşluk"], desc: "Oynat / duraklat", soon: true },
  { keys: ["Esc"], desc: "Açık pencereyi kapat" }
];

export default function KeyboardShortcutsDialog() {
  const { shortcutsOpen, setShortcutsOpen } = useLessonShell();
  const dialogRef = useRef<HTMLDivElement>(null);
  const mounted = useIsMounted();

  const onClose = useCallback(
    () => setShortcutsOpen(false),
    [setShortcutsOpen]
  );

  useDialogA11y(dialogRef, { open: shortcutsOpen, onClose });

  if (!mounted || !shortcutsOpen) return null;

  const tree = (
    <div
      className="lessons-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lessons-shortcuts-title"
        className="lessons-shortcuts"
      >
        <header className="lessons-shortcuts__header">
          <h2 id="lessons-shortcuts-title" className="lessons-shortcuts__title">
            Klavye kısayolları
          </h2>
          <button
            type="button"
            className="lessons-shortcuts__close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </header>
        <ul className="lessons-shortcuts__list">
          {shortcuts.map((s, i) => (
            <li key={i} className="lessons-shortcuts__item">
              <span className="lessons-shortcuts__keys">
                {s.keys.map((k, j) => (
                  <kbd key={j} className="lessons-kbd">{k}</kbd>
                ))}
              </span>
              <span className="lessons-shortcuts__desc">
                {s.desc}
                {s.soon && (
                  <span className="lessons-shortcuts__soon"> · yakında, player ile çalışacak</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return createPortal(tree, document.body);
}
