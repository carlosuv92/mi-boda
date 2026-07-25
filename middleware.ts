import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'admin_auth'
const ADMIN_SECRET = process.env.ADMIN_PASS || ''

export function isAdminAuthed(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value
  if (!cookie) return false

  try {
    const decoded = Buffer.from(cookie, 'base64url').toString('utf-8')
    const [user, pass, ts] = decoded.split(':')
    if (pass !== ADMIN_SECRET) return false

    const elapsed = Date.now() - parseInt(ts, 10)
    const maxAge = 24 * 60 * 60 * 1000 // 24h
    return elapsed < maxAge
  } catch {
    return false
  }
}

function denyAuth() {
  return NextResponse.json(
    { error: 'No autorizado' },
    { status: 401 }
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // Login is always public
  if (pathname === '/api/login') {
    return NextResponse.next()
  }

  // Public GET routes
  if (method === 'GET') {
    // Guest lookup by slug (public)
    const slug = request.nextUrl.searchParams.get('slug')
    if (pathname === '/api/guests' && slug && slug.trim() !== '') {
      return NextResponse.next()
    }
    // Public read routes
    if (
      pathname === '/api/timeline' ||
      pathname === '/api/songs' ||
      pathname === '/api/config' ||
      pathname === '/api/gallery' ||
      pathname === '/api/guest-gallery'
    ) {
      return NextResponse.next()
    }
  }

  // Public POST routes (guest-facing)
  if (method === 'POST') {
    if (
      pathname === '/api/rsvps' ||
      pathname === '/api/songs' ||
      pathname === '/api/guest-gallery'
    ) {
      return NextResponse.next()
    }
  }

  // Public GET/PUT for individual RSVP (guest checks their own)
  const rsvpMatch = pathname.match(/^\/api\/rsvps\/[^/]+$/)
  if (rsvpMatch && (method === 'GET' || method === 'PUT')) {
    return NextResponse.next()
  }

  // Everything else requires admin auth
  if (!isAdminAuthed(request)) {
    return denyAuth()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
