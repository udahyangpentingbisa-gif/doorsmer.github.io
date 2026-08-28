import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import {
  getAdminSession,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from '@/lib/server/auth'

export async function PUT(request: Request) {
  try {
    await requireAdmin()
  } catch (response) {
    return response instanceof Response
      ? response
      : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : ''
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : ''
  const confirmPassword = typeof body?.confirmPassword === 'string' ? body.confirmPassword : ''
  const session = await getAdminSession()
  const [user] = session
    ? await getDb().select().from(users).where(eq(users.id, session.userId)).limit(1)
    : []
  const currentPasswordValid = user ? await verifyPassword(currentPassword, user.passwordHash) : false

  if (!currentPasswordValid) {
    return NextResponse.json({ error: 'Password lama tidak sesuai.' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password baru minimal 8 karakter.' }, { status: 400 })
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: 'Konfirmasi password tidak sesuai.' }, { status: 400 })
  }

  try {
    const passwordHash = await hashPassword(newPassword)
    await getDb()
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, session!.userId))

    return NextResponse.json({ updated: true })
  } catch (error) {
    console.error('Failed to change admin password', error)
    return NextResponse.json({ error: 'Password gagal disimpan.' }, { status: 503 })
  }
}