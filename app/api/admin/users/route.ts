import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hashPassword, requireAdminRole } from '@/lib/server/auth'

function invalidUsername(username: string) {
  return !/^[a-zA-Z0-9._-]{3,50}$/.test(username)
}

function publicUser(user: typeof users.$inferSelect) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}

async function requireAdminResponse() {
  try {
    await requireAdminRole('admin')
    return null
  } catch (response) {
    return response instanceof Response
      ? response
      : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function GET() {
  const unauthorized = await requireAdminResponse()
  if (unauthorized) return unauthorized

  try {
    const rows = await getDb().select().from(users).where(eq(users.role, 'staff')).orderBy(desc(users.createdAt))
    return NextResponse.json({ users: rows.map(publicUser) })
  } catch (error) {
    console.error('Failed to list users', error)
    return NextResponse.json({ error: 'User gagal dimuat.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminResponse()
  if (unauthorized) return unauthorized

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const username = typeof body?.username === 'string' ? body.username.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (invalidUsername(username)) {
    return NextResponse.json({ error: 'Username 3-50 karakter: huruf, angka, titik, strip, atau underscore.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password minimal 8 karakter.' }, { status: 400 })
  }

  try {
    const [user] = await getDb()
      .insert(users)
      .values({ username, passwordHash: await hashPassword(password), role: 'staff' })
      .returning()
    return NextResponse.json({ user: publicUser(user) }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error && error.message.includes('users_username_unique')
      ? 'Username sudah digunakan.'
      : 'User gagal dibuat.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminResponse()
  if (unauthorized) return unauthorized

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const id = typeof body?.id === 'string' ? body.id : ''
  const password = typeof body?.password === 'string' ? body.password : undefined
  const active = typeof body?.active === 'boolean' ? body.active : undefined
  if (!id || (password !== undefined && password.length < 8) || active === undefined && password === undefined) {
    return NextResponse.json({ error: 'Data user tidak valid.' }, { status: 400 })
  }

  try {
    const [existing] = await getDb().select().from(users).where(eq(users.id, id)).limit(1)
    if (!existing || existing.role !== 'staff') {
      return NextResponse.json({ error: 'Staff tidak ditemukan.' }, { status: 404 })
    }
    const [user] = await getDb()
      .update(users)
      .set({
        ...(active === undefined ? {} : { active }),
        ...(password === undefined ? {} : { passwordHash: await hashPassword(password) }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()
    return NextResponse.json({ user: publicUser(user) })
  } catch (error) {
    console.error('Failed to update user', error)
    return NextResponse.json({ error: 'User gagal diperbarui.' }, { status: 503 })
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminResponse()
  if (unauthorized) return unauthorized

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const id = typeof body?.id === 'string' ? body.id : ''
  if (!id) return NextResponse.json({ error: 'User tidak valid.' }, { status: 400 })

  try {
    const [existing] = await getDb().select().from(users).where(eq(users.id, id)).limit(1)
    if (!existing || existing.role !== 'staff') {
      return NextResponse.json({ error: 'Staff tidak ditemukan.' }, { status: 404 })
    }
    await getDb().delete(users).where(eq(users.id, id))
    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error('Failed to delete user', error)
    return NextResponse.json({ error: 'User gagal dihapus.' }, { status: 503 })
  }
}