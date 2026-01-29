import { NextResponse } from 'next/server';

// Auth disabled for testing
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
