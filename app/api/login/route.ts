import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS;

  if (username === adminUser && password === adminPass) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_auth', 'true', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
}
