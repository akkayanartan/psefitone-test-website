"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject
} from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import { useDialogA11y, useIsMounted } from "./useDialogA11y";

interface Props {
  triggerRef: RefObject<HTMLButtonElement | null>;
  statements: string[];
  onConfirm: () => void;
  onClose: () => void;
}

interface Pos {
  top: number;
  left: number;
  width: number;
}

export default function CompleteLessonPopover({
  triggerRef,
  statements,
  onConfirm,
  onClose
}: Props) {
  const [checked, setChecked] = useState<boolean[]>(() => statements.map(() => false));
  const dialogRef = useRef<HTMLDivElement>(null);
  const mounted = useIsMounted();
  const [pos, setPos] = useState<Pos | null>(null);

  // Compute position from trigger rect — anchor above the button, centered.
  useLayoutEffect(() => {
    const recompute = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = 360;
      setPos({
        top: r.top - 12,
        left: r.left + r.width / 2,
        width
      });
    };
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", recompute, true);
    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute, true);
    };
  }, [triggerRef]);

  // Outside-click — switched to `click` and attached on next tick so the
  // opening click that fired this open doesn't immediately close it.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const dialog = dialogRef.current;
      const trigger = triggerRef.current;
      const target = e.target as Node | null;
      if (!target) return;
      if (dialog && dialog.contains(target)) return;
      if (trigger && trigger.contains(target)) return; // trigger handles its own toggle
      onClose();
    };
    const id = window.setTimeout(() => {
      document.addEventListener("click", onClick);
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("click", onClick);
    };
  }, [onClose, triggerRef]);

  const onCloseStable = useCallback(() => onClose(), [onClose]);
  useDialogA11y(dialogRef, { open: true, onClose: onCloseStable });

  const allChecked = checked.every(Boolean);

  if (!mounted || !pos) return null;

  const tree = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Bu dersi tamamlamadan önce"
      className="lessons-complete-popover lessons-complete-popover--portal"
      style={{
        top: pos.top,
        left: pos.left,
        width: pos.width
      }}
    >
      <header className="lessons-complete-popover__header">
        <h3 className="lessons-complete-popover__title">Bu dersi bitirmeden önce</h3>
        <button
          type="button"
          className="lessons-complete-popover__close"
          onClick={onClose}
          aria-label="Kapat"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </header>
      <p className="lessons-complete-popover__desc">
        Aşağıdakileri işaretleyebiliyorsan, bu ders gerçekten bitti demektir.
      </p>
      <ul className="lessons-complete-popover__list">
        {statements.map((s, i) => (
          <li key={i}>
            <label className="lessons-checkrow">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={(e) => {
                  const next = [...checked];
                  next[i] = e.target.checked;
                  setChecked(next);
                }}
              />
              <span className="lessons-checkrow__box" aria-hidden="true">
                {checked[i] && <Check size={12} />}
              </span>
              <span className="lessons-checkrow__text">{s}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="lessons-complete-popover__footer">
        <button
          type="button"
          className="lessons-btn lessons-btn--primary"
          disabled={!allChecked}
          onClick={onConfirm}
        >
          <Check size={14} aria-hidden="true" />
          <span>Tamamlandı olarak işaretle</span>
        </button>
      </div>
    </div>
  );

  return createPortal(tree, document.body);
}
