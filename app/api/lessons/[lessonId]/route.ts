/**
 * GET /api/lessons/[lessonId] — PUBLIC lesson-sync read API.
 *
 * Returns the stored video trim/offset/BPM values for a lesson. Reads from
 * SQLite first; if that fails (Vercel prod has a read-only fs and SQLite
 * cannot persist), falls back to the TS-baked map in
 * `lib/player/lesson-sync-fallback.ts`.
 *
 * NOTE: this route is intentionally PUBLIC — no `requireAdmin()`. The
 * lesson player on the marketing/lessons surface needs read access without
 * an admin session.
 */

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/admin/db';
import { lessonSync } from '@/lib/admin/schema';
import { getLessonSyncFallback } from '@/lib/player/lesson-sync-fallback';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ lessonId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { lessonId } = await context.params;

  // Try SQLite first. The whole call is wrapped in try/catch because on
  // Vercel prod the filesystem is read-only — `getDb()` itself can throw
  // when better-sqlite3 attempts to mkdir / open the WAL file.
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(lessonSync)
      .where(eq(lessonSync.lessonId, lessonId))
      .limit(1);
    const row = rows[0];
    if (row) {
      return NextResponse.json({
        lessonId: row.lessonId,
        videoTrimStart: row.videoTrimStart,
        videoTrimEnd: row.videoTrimEnd,
        videoOffset: row.videoOffset,
        originalBpm: row.originalBpm,
        updatedAt: row.updatedAt,
      });
    }
  } catch {
    // Swallow — fall through to the fallback path below.
  }

  // SQLite missed (no row, or driver threw). Try the TS-baked fallback so
  // Vercel prod can still serve a value for lessons whose tunings were
  // captured locally and committed.
  const fallback = getLessonSyncFallback(lessonId);
  if (fallback) {
    return NextResponse.json({
      lessonId,
      videoTrimStart: fallback.videoTrimStart,
      videoTrimEnd: fallback.videoTrimEnd,
      videoOffset: fallback.videoOffset,
      originalBpm: fallback.originalBpm,
      updatedAt: null,
    });
  }

  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}
