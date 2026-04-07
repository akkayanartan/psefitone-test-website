"use client";
import { SparklesCore } from "@/components/SparklesCore";

export default function GlobalSparkles() {
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
