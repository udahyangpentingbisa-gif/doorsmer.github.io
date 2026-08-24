import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { adminCredentials } from '@/lib/db/schema'
import {
  getAdminPasswordHash,
  hashAdminPassword,
  requireAdmin,
  verifyAdminPassword,
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
  const storedHash = await getAdminPasswordHash()
  const currentPasswordValid = storedHash
    ? await verifyAdminPassword(currentPassword, storedHash)
    : currentPassword === process.env.ADMIN_PASSWORD

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
    const passwordHash = await hashAdminPassword(newPassword)
    await getDb()
      .insert(adminCredentials)
      .values({ id: 1, passwordHash })
      .onConflictDoUpdate({
        target: adminCredentials.id,
        set: { passwordHash, updatedAt: new Date() },
      })

    return NextResponse.json({ updated: true })
  } catch (error) {
    console.error('Failed to change admin password', error)
    return NextResponse.json({ error: 'Password gagal disimpan.' }, { status: 503 })
  }
}