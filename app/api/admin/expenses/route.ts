import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin/auth';
import { getDb } from '@/lib/admin/db';
import { expenses } from '@/lib/admin/schema';

export const runtime = 'nodejs';

const ISO_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const CreateBody = z.object({
  occurredAt: z.string().regex(ISO_DATE),
  category: z.string().trim().min(1).max(60),
  amountKurus: z.number().int().min(0),
  status: z.enum(['paid', 'deferred']),
  note: z.string().trim().max(500).optional().nullable(),
});

export async function GET() {
  await requireAdmin();
  const db = getDb();
  const rows = await db.select().from(expenses).orderBy(desc(expenses.occurredAt), desc(expenses.id));
  return NextResponse.json({ expenses: rows });
}

export async function POST(request: Request) {
  await requireAdmin();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const parsed = CreateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_body', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const db = getDb();
  const inserted = await db
    .insert(expenses)
    .values({
      occurredAt: parsed.data.occurredAt,
      category: parsed.data.category,
      amountKurus: parsed.data.amountKurus,
      status: parsed.data.status,
      note: parsed.data.note ?? null,
    })
    .returning();

  return NextResponse.json({ expense: inserted[0] }, { status: 201 });
}
