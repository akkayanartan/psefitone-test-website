"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/lib/useReducedMotion";

const SparklesCore = dynamic(
  () => import("@/components/SparklesCore").then((m) => m.SparklesCore),
  { ssr: false, loading: () => null },
);

export default function GlobalSparkles() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    const w = window as IdleWindow;
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const idleId = schedule(() => setReady(true));

    return () => {
      mq.removeEventListener("change", onChange);
      if (typeof idleId === "number") clearTimeout(idleId);
    };
  }, []);

  if (reduced || !isDesktop || !ready) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    >
      <SparklesCore
        background="transparent"
        particleColor="#cbc3d6"
        particleDensity={45}
        minSize={0.3}
        maxSize={1.2}
        speed={0.5}
        className="w-full h-full"
      />
    </div>
  );
}
