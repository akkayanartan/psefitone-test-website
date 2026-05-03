"use client";

/**
 * PlayerLab — client island for /lab/player.
 *
 * As of Step 4, this file dynamic-imports `AlphaTabPlayer` with `ssr: false`
 * (the only way to keep AlphaTab — a browser-only library that touches
 * `window`/`Worker` at module init — out of the server bundle). The Next 16
 * docs confirm `ssr: false` on `next/dynamic` ONLY works inside a `'use client'`
 * component (`node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`):
 *
 *   > `ssr: false` option is not supported in Server Components.
 *
 * `loading: () => <LoadingCard />` reuses the Step-2 fallback verbatim while
 * the chunk downloads + AlphaTab initializes. The visual transition is
 * deliberately seamless: `AlphaTabPlayer` mounts on a matching dark-violet
 * background with a glow in the same position, so the user sees the title
 * resolve in place rather than a hard cut.
 *
 * This file still does NOT import `@coderline/alphatab` directly — only via
 * the dynamic import — so the landing page bundle remains AlphaTab-free.
 * Verification gate: `curl /` HTML shows zero AlphaTab references.
 */

import dynamic from "next/dynamic";
import LoadingCard from "./LoadingCard";

/**
 * AlphaTab is browser-only — `dynamic(..., { ssr: false })` from inside a
 * `'use client'` boundary is the documented Next 16 path. The `loading`
 * fallback shows `<LoadingCard fillMode="viewport" />` while the AlphaTab chunk
 * downloads + the player initializes. No `<Suspense>` wrapper needed: `next/dynamic`
 * handles the boundary internally when `loading` is provided.
 */
const AlphaTabPlayer = dynamic(() => import("./AlphaTabPlayer"), {
  ssr: false,
  loading: () => <LoadingCard fillMode="viewport" />,
});

export default function PlayerLab() {
  return <AlphaTabPlayer />;
}
