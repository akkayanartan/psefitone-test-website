/**
 * Next.js 16 Proxy (formerly Middleware) — gates the /admin area.
 *
 * Optimistic check only: verifies the JWT in the session cookie and redirects
 * to /admin/login on failure. Page components and Route Handlers re-verify
 * via `requireAdmin()` from `lib/admin/auth.ts` to defend against direct
 * fetches that bypass the proxy.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { SESSION_COOKIE } from './lib/admin/auth';

const SECRET_BYTES = process.env.SESSION_SECRET
  ? new TextEncoder().encode(process.env.SESSION_SECRET)
  : null;

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token || !SECRET_BYTES) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET_BYTES, {
      algorithms: ['HS256'],
    });
    return payload.sub === 'admin';
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin module is local-only. Block all /admin and /api/admin routes
  // when running on Vercel so the public deployment never exposes it.
  if (process.env.VERCEL === '1') {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Allow the login page itself and its API endpoint.
  if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = await isValidSession(token);
  if (valid) return NextResponse.next();

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
