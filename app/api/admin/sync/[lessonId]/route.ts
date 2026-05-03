/**
 * /api/admin/sync/[lessonId] — admin-only lesson-sync editor backend.
 *
 * GET — returns the stored sync record (404 if none).
 * PUT — upserts the sync record from a validated body.
 *
 * Manual-copy workflow:
 *  After a successful PUT, the route logs the updated record to the dev
 *  console. The instructor copies that JSON into
 *  `lib/player/lesson-sync-fallback.ts` before committing so the values
 *  ship to Vercel prod, where the SQLite write path is unavailable
 *  (Vercel's serverless fs is read-only).
 *
 *  Both handlers call `requireAdmin()` first; on Vercel the proxy 404s the
 *  whole `/api/admin/*` tree before this file is even reached, so this
 *  route is effectively dev-only.
 */

import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin/auth';
import { getDb } from '@/lib/admin/db';
import { lessonSync } from '@/lib/admin/schema';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ lessonId: string }>;
}

const SyncBody = z.object({
  videoTrimStart: z.number().min(0),
  videoTrimEnd: z.number().min(0).nullable(),
  videoOffset: z.number(),
  originalBpm: z.number().min(20).max(400).nullable(),
});

export async function GET(_request: Request, context: RouteContext) {
  await requireAdmin();
  const { lessonId } = await context.params;

  const db = getDb();
  const rows = await db
    .select()
    .from(lessonSync)
    .where(eq(lessonSync.lessonId, lessonId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({
    lessonId: row.lessonId,
    videoTrimStart: row.videoTrimStart,
    videoTrimEnd: row.videoTrimEnd,
    videoOffset: row.videoOffset,
    originalBpm: row.originalBpm,
    updatedAt: row.updatedAt,
  });
}

/**
 * PUT — upsert the lesson sync record. Logs the saved row to the dev
 * console so the instructor can copy values into the fallback map before
 * committing (see file-level docblock).
 */
export async function PUT(request: Request, context: RouteContext) {
  await requireAdmin();
  const { lessonId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const parsed = SyncBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_body', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const updatedAt = Date.now();
  const values = {
    lessonId,
    videoTrimStart: parsed.data.videoTrimStart,
    videoTrimEnd: parsed.data.videoTrimEnd,
    videoOffset: parsed.data.videoOffset,
    originalBpm: parsed.data.originalBpm,
    updatedAt,
  };

  const db = getDb();
  const upserted = await db
    .insert(lessonSync)
    .values(values)
    .onConflictDoUpdate({
      target: lessonSync.lessonId,
      set: {
        videoTrimStart: values.videoTrimStart,
        videoTrimEnd: values.videoTrimEnd,
        videoOffset: values.videoOffset,
        originalBpm: values.originalBpm,
        updatedAt: values.updatedAt,
      },
    })
    .returning();

  const record = upserted[0];
  // Surface the saved row in the dev console so the instructor can copy
  // the values into `lib/player/lesson-sync-fallback.ts` before committing.
  console.log(
    '[admin-sync] lesson',
    lessonId,
    'updated:',
    JSON.stringify(record),
  );

  return NextResponse.json({
    lessonId: record.lessonId,
    videoTrimStart: record.videoTrimStart,
    videoTrimEnd: record.videoTrimEnd,
    videoOffset: record.videoOffset,
    originalBpm: record.originalBpm,
    updatedAt: record.updatedAt,
  });
}
