import { NextResponse } from 'next/server'
import {
  adminSessionCookie,
  adminSessionMaxAge,
  createAdminSession,
  getAdminPasswordHash,
  getAdminRole,
  verifyAdminPassword,
} from '@/lib/server/auth'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  const storedHash = await getAdminPasswordHash()
  let role: 'admin' | 'staff' | null = null
  const adminPasswordValid = storedHash
    ? await verifyAdminPassword(password, storedHash)
    : password === process.env.ADMIN_PASSWORD

  if (username === process.env.ADMIN_USERNAME && adminPasswordValid) {
    role = 'admin'
  } else if (username === process.env.STAFF_USERNAME && password === process.env.STAFF_PASSWORD) {
    role = 'staff'
  }

  if (!role) {
    return NextResponse.json({ error: 'Username atau password tidak sesuai.' }, { status: 401 })
  }

  const session = createAdminSession(role)
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