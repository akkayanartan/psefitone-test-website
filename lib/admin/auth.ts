/**
 * Single-password admin auth.
 *
 * The instructor logs in with one password (env `ADMIN_PASSWORD`). On success
 * we sign a stateless JWT (HS256, 7-day expiry) with `jose` and store it in an
 * httpOnly cookie. `proxy.ts` and Route Handlers verify the cookie before
 * touching data.
 *
 * No database, no user table — this is a single-tenant tool. If a second user
 * ever joins, swap to a real auth library (NextAuth, Better Auth) before
 * adding roles.
 */

import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE = 'psefitone_admin_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

interface SessionPayload extends JWTPayload {
  sub: 'admin';
}

function requireSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET env var missing or too short (min 32 chars). ' +
        'Generate one with: openssl rand -base64 32',
    );
  }
  return new TextEncoder().encode(secret);
}

export function verifyPassword(plain: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error('ADMIN_PASSWORD env var not set');
  }
  if (plain.length !== expected.length) return false;
  // Constant-time compare.
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= plain.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function signSession(): Promise<string> {
  return await new SignJWT({ sub: 'admin' } satisfies SessionPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(requireSecret());
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, requireSecret(), {
      algorithms: ['HS256'],
    });
    return payload.sub === 'admin';
  } catch {
    return false;
  }
}

export async function createSessionCookie(): Promise<void> {
  const token = await signSession();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function deleteSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function readSessionFromCookies(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/**
 * Use inside `/admin/*` server components and admin Route Handlers.
 * Redirects to /admin/login if the session is invalid.
 */
export async function requireAdmin(): Promise<void> {
  const ok = await readSessionFromCookies();
  if (!ok) redirect('/admin/login');
}
