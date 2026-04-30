import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Protected routes checking
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  
  if (isAuthRoute) {
    if (session) {
      // Redirect logged-in users away from auth pages
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Role-based route protection
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/cart') || pathname.startsWith('/checkout')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.user.role !== 'USER' && session.user.role !== 'STUDENT') {
      // Different roles have different dashboards
      return NextResponse.redirect(new URL(`/${session.user.role.toLowerCase()}/dashboard`, request.url))
    }
  }

  if (pathname.startsWith('/writer')) {
    if (!session || session.user.role !== 'WRITER') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/developer')) {
    if (!session || session.user.role !== 'DEVELOPER') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/founder')) {
    if (!session || session.user.role !== 'FOUNDER') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/affiliate')) {
    if (!session || session.user.role !== 'AFFILIATE') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Contact Scanner - Block messages or requests containing contact info
  // Since it's a bit tricky to read body in middleware without consuming the stream,
  // we might implement this directly in the API routes. 
  // We'll leave the pattern matching logic in lib/contact-scanner.ts for API use.

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
