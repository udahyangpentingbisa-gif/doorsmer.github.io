import { promisify } from 'node:util'
import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hashPassword, verifyPassword } from './password'

const SESSION_COOKIE = 'bogelwash-admin-session'
const SESSION_TTL_SECONDS = 60 * 60 * 12

export type AdminRole = 'admin' | 'staff'
export type AdminSession = { userId: string; username: string; role: AdminRole }

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not configured')
  return value
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('hex')
}

export function createAdminSession(user: AdminSession) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = `${user.userId}.${user.username}.${user.role}.${expires}`
  const value = `${payload}.${sign(payload)}`
  return { value, expires }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value
  if (!value) return null

  const [userId, username, role, expiresText, signature] = value.split('.')
  if (role !== 'admin' && role !== 'staff') return null
  const expires = Number(expiresText)
  if (!Number.isSafeInteger(expires) || expires < Math.floor(Date.now() / 1000)) {
    return null
  }

  const payload = `${userId}.${username}.${role}.${expiresText}`
  const expected = sign(payload)
  if (!signature || signature.length !== expected.length) return null
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null

  try {
    const [user] = await getDb()
      .select({ id: users.id, username: users.username, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    if (!user || user.username !== username || user.role !== role) return null
    return { userId: user.id, username: user.username, role }
  } catch {
    return null
  }
}

export async function getAdminRole(): Promise<AdminRole | null> {
  return (await getAdminSession())?.role ?? null
}

export async function isAdminAuthenticated() {
  return (await getAdminRole()) !== null
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Response('Unauthorized', { status: 401 })
  }
}

export async function requireAdminRole(role: AdminRole) {
  if ((await getAdminRole()) !== role) {
    throw new Response('Unauthorized', { status: 401 })
  }
}

export const adminSessionCookie = SESSION_COOKIE
export const adminSessionMaxAge = SESSION_TTL_SECONDS

export async function findUserByUsername(username: string) {
  try {
    const [user] = await getDb()
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
    return user ?? null
  } catch {
    return null
  }
}

export { hashPassword, verifyPassword }