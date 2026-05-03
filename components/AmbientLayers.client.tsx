"use client";
import { usePathname } from "next/navigation";
import GlobalSparkles from "@/components/GlobalSparkles";

/**
 * Site-wide ambient layer host.
 *
 * Skips heavy always-on layers (currently `GlobalSparkles`, an ever-running
 * tsParticles canvas) on the `/lab/*` routes. Those routes — most notably
 * `/lab/player` — own a 60 fps frame budget for AlphaTab + video sync, and any
 * extra always-on RAF / particle work cuts directly into that budget.
 *
 * The static `NoiseOverlay` in `app/layout.tsx` is intentionally NOT gated
 * here: it's a single ~1 kB `aria-hidden` div with no JS or animation cost.
 */
export default function AmbientLayers() {
  const pathname = usePathname();
  if (pathname?.startsWith("/lab/")) return null;
  return <GlobalSparkles />;
}
