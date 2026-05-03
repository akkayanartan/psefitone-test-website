import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSessionCookie, verifyPassword } from '@/lib/admin/auth';

export const runtime = 'nodejs';

const Body = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (!verifyPassword(parsed.data.password)) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  await createSessionCookie();
  return NextResponse.json({ ok: true });
}
