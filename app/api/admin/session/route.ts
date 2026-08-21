import { NextResponse } from 'next/server'
import {
  adminSessionCookie,
  adminSessionMaxAge,
  createAdminSession,
  isAdminAuthenticated,
} from '@/lib/server/auth'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: 'Username atau password tidak sesuai.' }, { status: 401 })
  }

  const session = createAdminSession()
  const response = NextResponse.json({ authenticated: true })
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
  return NextResponse.json({ authenticated: await isAdminAuthenticated() })
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set(adminSessionCookie, '', { maxAge: 0, path: '/' })
  return response
}