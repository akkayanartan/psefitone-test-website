"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import PayTRIframe from "@/components/payment/PayTRIframe";
import {
  useDialogA11y,
  useIsMounted,
} from "@/components/lessons/useDialogA11y";

interface Props {
  open: boolean;
  token: string | null;
  merchantOid: string | null;
  onClose: () => void;
}

const DRAG_CLOSE_THRESHOLD = 120;

export default function PayTRPaymentSheet({
  open,
  token,
  merchantOid,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const mounted = useIsMounted();

  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);
  const dragging = useRef(false);

  useDialogA11y(dialogRef, {
    open,
    onClose,
    initialFocusRef: closeBtnRef,
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) setDragOffset(0);
  }, [open]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;
    dragStartY.current = e.touches[0]?.clientY ?? null;
    dragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current || dragStartY.current === null) return;
    const dy = (e.touches[0]?.clientY ?? 0) - dragStartY.current;
    if (dy > 0) setDragOffset(dy);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dragOffset > DRAG_CLOSE_THRESHOLD) {
      onClose();
    } else {
      setDragOffset(0);
    }
    dragStartY.current = null;
  }, [dragOffset, onClose]);

  if (!mounted || !open || !token) return null;

  const sheetStyle: React.CSSProperties = dragOffset
    ? {
        transform: `translateY(${dragOffset}px)`,
        transition: dragging.current ? "none" : "transform 0.24s ease-out",
      }
    : {};

  const tree = (
    <div
      className="payment-sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paytr-sheet-title"
        className="payment-sheet"
      >
        <div
          ref={sheetRef}
          className="payment-sheet__inner"
          style={sheetStyle}
        >
          <button
            type="button"
            className="payment-sheet__handle"
            aria-label="Aşağı kaydırarak kapat"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <span aria-hidden="true" />
          </button>

          <header className="payment-sheet__header">
            <div className="payment-sheet__header-left">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h2 id="paytr-sheet-title" className="payment-sheet__title">
                Kart Bilgileri
              </h2>
            </div>
            <div className="payment-sheet__header-right">
              <span className="payment-sheet__badge">3D Secure</span>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="payment-sheet__close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          <div className="payment-sheet__body">
            <PayTRIframe token={token} merchantOid={merchantOid ?? undefined} />
          </div>

          <footer className="payment-sheet__footer">
            <TrustBadge label="256-bit SSL" />
            <Dot />
            <TrustBadge label="PayTR Sanal POS" />
            {merchantOid ? (
              <>
                <Dot />
                <span className="payment-sheet__ref" title={merchantOid}>
                  Ref:{" "}
                  <span className="font-mono">
                    {merchantOid.slice(-10)}
                  </span>
                </span>
              </>
            ) : null}
          </footer>
        </div>
      </div>
    </div>
  );

  return createPortal(tree, document.body);
}

function TrustBadge({ label }: { label: string }) {
  return (
    <span className="payment-sheet__trust">
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {label}
    </span>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="payment-sheet__dot">
      ·
    </span>
  );
}
