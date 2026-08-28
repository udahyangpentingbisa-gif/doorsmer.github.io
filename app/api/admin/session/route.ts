import { NextResponse } from 'next/server'
import {
  adminSessionCookie,
  adminSessionMaxAge,
  createAdminSession,
  getAdminRole,
  findUserByUsername,
  verifyPassword,
} from '@/lib/server/auth'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  const user = await findUserByUsername(username)
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Username atau password tidak sesuai.' }, { status: 401 })
  }

  const role = user.role as 'admin' | 'staff'
  const session = createAdminSession({ userId: user.id, username: user.username, role })
  const response = NextResponse.json({ authenticated: true, role })
  response.cookies.set(adminSessionCookie, session.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: adminSessionMaxAge,
    path: '/',
  })
  return response
}

export async function GET() {
  const role = await getAdminRole()
  return NextResponse.json({ authenticated: role !== null, role })
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set(adminSessionCookie, '', { maxAge: 0, path: '/' })
  return response
}