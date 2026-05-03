import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin/auth';
import { getDb } from '@/lib/admin/db';
import { payments } from '@/lib/admin/schema';

export const runtime = 'nodejs';

export async function DELETE(
  _req: Request,
  ctx: RouteContext<'/api/admin/payments/[id]'>,
) {
  await requireAdmin();
  const { id } = await ctx.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }
  const db = getDb();
  const deleted = await db.delete(payments).where(eq(payments.id, numericId)).returning();
  if (deleted.length === 0) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
