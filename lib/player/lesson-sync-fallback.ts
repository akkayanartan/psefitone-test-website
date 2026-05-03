/**
 * lesson-sync-fallback — TS-baked fallback for the public lesson-sync read API.
 *
 * Why this exists: Vercel's serverless filesystem is read-only at runtime, so
 * SQLite reads at `/api/lessons/[lessonId]` will fail in prod. This module
 * provides a code-shipped fallback values map that the public route falls
 * back to when the DB read throws.
 *
 * Manual-copy workflow:
 *  1. Run the dev server locally (SQLite-backed admin works there).
 *  2. Edit the SyncEditor in `/lab/player`, save.
 *  3. The admin PUT route logs the saved record to the dev console.
 *  4. Copy the values into the FALLBACK map below before committing.
 *  5. The committed values now ship to Vercel and serve the public route.
 *
 * NOTE: this file deliberately avoids importing from `@/lib/admin/*` — that
 * path is `'server-only'`, and this module is read by a public (non-admin)
 * route that should not pull the admin DB driver into its bundle.
 */

export type FallbackEntry = {
  videoTrimStart: number;
  videoTrimEnd: number | null;
  videoOffset: number;
  originalBpm: number | null;
};

const FALLBACK: Record<string, FallbackEntry> = {
  // Empty for now. After saving a value via the admin SyncEditor in dev,
  // copy the logged record here before committing to ship the values to prod
  // (Vercel filesystem is read-only at runtime).
  // 'lab-sample': { videoTrimStart: 0, videoTrimEnd: null, videoOffset: 0, originalBpm: 120 },
};

export function getLessonSyncFallback(lessonId: string): FallbackEntry | null {
  return FALLBACK[lessonId] ?? null;
}
