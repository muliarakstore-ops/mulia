import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect office dashboard and business routes
  if (path.startsWith('/office/dashboard') || path.startsWith('/office/business')) {
    const sessionToken = request.cookies.get('mrs_session_token')?.value;
    const userEmail = request.cookies.get('mrs_session_user')?.value || '';

    // If no token exists, redirect to login page immediately at server-level
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/office', request.url));
    }

    // Role-based protection: only iqbal@muliarak.store can access /office/business
    if (path.startsWith('/office/business') && userEmail.toLowerCase() !== 'iqbal@muliarak.store') {
      return NextResponse.redirect(new URL('/office/dashboard', request.url));
    }

    // Role-based protection: arif@muliarak.store cannot access /office/business
    if (path.startsWith('/office/dashboard') && userEmail.toLowerCase() === 'iqbal@muliarak.store') {
      return NextResponse.redirect(new URL('/office/business', request.url));
    }
  }

  return NextResponse.next();
}

// Configure routes to run the middleware on
export const config = {
  matcher: ['/office/dashboard/:path*', '/office/business/:path*'],
};
