import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// proxy.ts (Next.js 16) — solo para rewrites/redirects de red.
// La autenticación se maneja en app/(admin)/layout.tsx (Server Layout Guard).
// Ver: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
export default function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
