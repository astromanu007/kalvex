import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth-middleware'

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

  // Role-based route protection — /cart and /checkout are intentionally public
  // (the checkout server action handles auth internally)
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const role = session.user.role
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (role === 'WRITER' || role === 'DEVELOPER') {
      return NextResponse.redirect(new URL('/expert', request.url))
    }
    if (role === 'AFFILIATE') {
      return NextResponse.redirect(new URL('/dashboard/affiliate', request.url))
    }
    
    if (role !== 'USER' && role !== 'STUDENT') {
      // For other roles, redirect if a specific dashboard exists, otherwise keep at /dashboard
      // For now, we'll just handle ADMIN specifically as it's a known path
      return NextResponse.next()
    }
  }

  if (pathname.startsWith('/expert')) {
    if (!session || (session.user.role !== 'WRITER' && session.user.role !== 'DEVELOPER')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/writer')) {
    return NextResponse.redirect(new URL('/expert', request.url))
  }

  if (pathname.startsWith('/developer')) {
    return NextResponse.redirect(new URL('/expert', request.url))
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
    return NextResponse.redirect(new URL('/dashboard/affiliate', request.url))
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
