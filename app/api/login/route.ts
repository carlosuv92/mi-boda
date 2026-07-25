import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()
  const adminUser = process.env.ADMIN_USER || 'admin'
  const adminPass = process.env.ADMIN_PASS

  if (username === adminUser && password === adminPass) {
    const token = Buffer.from(`${username}:${password}:${Date.now()}`).toString('base64url')
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_auth', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24h
    })
    return response
  }

  return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
}
