import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = path === '/signin' || path === '/signup';


    const token = request.cookies.get('__Host-next-auth.csrf-token')?.value || 
                  request.cookies.get('__Secure-next-auth.session-token')?.value || '';


  // If the user is on a public page and has a token, redirect to home page
  if (isPublic && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is not on a public page and doesn't have a token, redirect to signin page
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/', '/signin', '/signup', '/writeblog',
  ],
};
