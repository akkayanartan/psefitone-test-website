"use client";

/**
 * SplitPane — resizable two-pane primitive for the Psefitone Player Cockpit.
 *
 * Drag math runs in pointer event handlers using DOM mutations (CSS custom
 * property + data attributes) — ZERO React re-renders during drag. State only
 * commits on `pointerup` via `onSplitChange` / `onCollapseChange`. Snap-collapse
 * preview is shown via `data-collapsed-preview` while dragging; the actual
 * collapsed state is committed on release.
 *
 * Keyboard: handle is `role="separator"`, `tabIndex=0`, supports Arrow / Home /
 * End / Enter / Space per the splitter behavior contract in the redesign plan.
 *
 * NOTE: `aria-orientation` on a separator describes the orientation OF THE
 * SEPARATOR — perpendicular to the split axis. Horizontal split → vertical
 * separator handle.
 */

import {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

export type SplitOrientation = "horizontal" | "vertical";
export type SplitCollapsed = "first" | "second" | null;

export interface SplitPaneProps {
  orientation: SplitOrientation;
  /** 0..100 — percentage of the FIRST child. */
  splitPct: number;
  collapsed: SplitCollapsed;
  /** Called only on pointerup commit OR keyboard arrow press — never during drag. */
  onSplitChange: (pct: number) => void;
  onCollapseChange: (collapsed: SplitCollapsed) => void;
  /** Snap-collapse threshold in percent from each edge. Default 12. */
  threshold?: number;
  /** Tuple — exactly first + second pane content. */
  children: [ReactNode, ReactNode];
  /** Accessible label for the separator handle. Default "Bölücü". */
  ariaLabel?: string;
}

const DEFAULT_THRESHOLD = 12;
const KEYBOARD_STEP = 5;

const clamp = (n: number, min = 0, max = 100): number => {
  if (Number.isNaN(n)) return min;
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

export default function SplitPane(props: SplitPaneProps) {
  const {
    orientation,
    splitPct,
    collapsed,
    onSplitChange,
    onCollapseChange,
    threshold = DEFAULT_THRESHOLD,
    children,
    ariaLabel,
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drag refs — never trigger re-renders during pointermove.
  const isDragging = useRef(false);
  const dragRect = useRef<DOMRect | null>(null);
  const dragOrientation = useRef<SplitOrientation>(orientation);
  const dragThreshold = useRef<number>(threshold);
  const latestPct = useRef<number>(splitPct);
  const latestPreview = useRef<SplitCollapsed>(null);

  // Keep latest committed splitPct on a ref so pointercancel can revert
  // without re-reading props in the handler.
  const committedPct = useRef<number>(splitPct);
  const committedCollapsed = useRef<SplitCollapsed>(collapsed);
  useEffect(() => {
    committedPct.current = splitPct;
  }, [splitPct]);
  useEffect(() => {
    committedCollapsed.current = collapsed;
  }, [collapsed]);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      // Only the primary pointer button (or any touch/pen) should start a drag.
      if (e.pointerType === "mouse" && e.button !== 0) return;

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* setPointerCapture can throw if the element is detached — non-fatal */
      }

      dragRect.current = container.getBoundingClientRect();
      dragOrientation.current = orientation;
      dragThreshold.current = threshold;
      latestPct.current = committedPct.current;
      latestPreview.current = committedCollapsed.current;
      isDragging.current = true;
      container.dataset.dragging = "true";
    },
    [orientation, threshold]
  );

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const rect = dragRect.current;
    const container = containerRef.current;
    if (!rect || !container) return;

    const orient = dragOrientation.current;
    let raw: number;
    if (orient === "horizontal") {
      raw = ((e.clientX - rect.left) / rect.width) * 100;
    } else {
      raw = ((e.clientY - rect.top) / rect.height) * 100;
    }
    const clamped = clamp(raw);

    let preview: SplitCollapsed = null;
    const t = dragThreshold.current;
    if (clamped < t) preview = "first";
    else if (clamped > 100 - t) preview = "second";

    // DOM mutation only — no React state.
    container.style.setProperty("--split-pct", `${clamped}%`);
    if (preview === null) {
      delete container.dataset.collapsedPreview;
    } else {
      container.dataset.collapsedPreview = preview;
    }

    latestPct.current = clamped;
    latestPreview.current = preview;
  }, []);

  const finishDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, commit: boolean) => {
      if (!isDragging.current) return;
      const container = containerRef.current;

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* pointer capture can already be lost — non-fatal */
      }

      isDragging.current = false;
      dragRect.current = null;

      if (container) {
        delete container.dataset.dragging;
        delete container.dataset.collapsedPreview;
        if (!commit) {
          // Revert the inline CSS variable so the next render matches state.
          container.style.setProperty(
            "--split-pct",
            `${committedPct.current}%`
          );
        }
      }

      if (commit) {
        const pct = latestPct.current;
        const preview = latestPreview.current;
        // Always commit splitPct so React state matches the visible position.
        onSplitChange(pct);
        // Commit collapsed state regardless — React will diff against current.
        onCollapseChange(preview);
      }
    },
    [onSplitChange, onCollapseChange]
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      finishDrag(e, true);
    },
    [finishDrag]
  );

  const handlePointerCancel = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      finishDrag(e, false);
    },
    [finishDrag]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const isHorizontal = orientation === "horizontal";
      const decrease = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const increase = isHorizontal ? "ArrowRight" : "ArrowDown";

      if (e.key === decrease) {
        e.preventDefault();
        if (collapsed !== null) onCollapseChange(null);
        onSplitChange(clamp(splitPct - KEYBOARD_STEP));
        return;
      }
      if (e.key === increase) {
        e.preventDefault();
        if (collapsed !== null) onCollapseChange(null);
        onSplitChange(clamp(splitPct + KEYBOARD_STEP));
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        onCollapseChange("first");
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        onCollapseChange("second");
        return;
      }
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        // Toggle: if collapsed → restore at 50/50; else snap to 50/50.
        if (collapsed !== null) {
          onCollapseChange(null);
          onSplitChange(50);
        } else {
          onSplitChange(50);
        }
        return;
      }
    },
    [orientation, splitPct, collapsed, onSplitChange, onCollapseChange]
  );

  const separatorAriaOrientation =
    orientation === "horizontal" ? "vertical" : "horizontal";

  return (
    <div
      ref={containerRef}
      className="psef-split"
      data-orientation={orientation}
      data-collapsed={collapsed ?? ""}
      style={
        {
          // Initial CSS variable — kept in sync with state. Drag handlers
          // mutate this directly during pointermove.
          ["--split-pct" as string]: `${splitPct}%`,
        } as React.CSSProperties
      }
    >
      <div className="psef-split__first">{children[0]}</div>
      <div
        role="separator"
        tabIndex={0}
        aria-orientation={separatorAriaOrientation}
        aria-valuenow={Math.round(splitPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? "Bölücü"}
        className="psef-split__handle"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
      />
      <div className="psef-split__second">{children[1]}</div>
    </div>
  );
}
