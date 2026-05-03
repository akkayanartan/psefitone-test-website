import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/admin/auth';

export const runtime = 'nodejs';

export async function POST() {
  await deleteSessionCookie();
  return NextResponse.json({ ok: true });
}
