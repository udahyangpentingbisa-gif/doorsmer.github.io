import { promisify } from 'node:util'
import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { adminCredentials } from '@/lib/db/schema'

const SESSION_COOKIE = 'bogelwash-admin-session'
const SESSION_TTL_SECONDS = 60 * 60 * 12

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not configured')
  return value
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('hex')
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const value = `${expires}.${sign(String(expires))}`
  return { value, expires }
}

export async function isAdminAuthenticated() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value
  if (!value) return false

  const [expiresText, signature] = value.split('.')
  const expires = Number(expiresText)
  if (!Number.isSafeInteger(expires) || expires < Math.floor(Date.now() / 1000)) {
    return false
  }

  const expected = sign(expiresText)
  if (signature.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Response('Unauthorized', { status: 401 })
  }
}

export const adminSessionCookie = SESSION_COOKIE
export const adminSessionMaxAge = SESSION_TTL_SECONDS

const scryptAsync = promisify(scrypt)

export async function getAdminPasswordHash() {
  try {
    const [credential] = await getDb()
      .select({ passwordHash: adminCredentials.passwordHash })
      .from(adminCredentials)
      .where(eq(adminCredentials.id, 1))
      .limit(1)
    return credential?.passwordHash ?? null
  } catch {
    return null
  }
}

export async function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  return `scrypt:${salt}:${derivedKey.toString('hex')}`
}

export async function verifyAdminPassword(password: string, storedHash: string) {
  const [, salt, key] = storedHash.split(':')
  if (!salt || !key) return false

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  const expectedKey = Buffer.from(key, 'hex')
  return derivedKey.length === expectedKey.length && timingSafeEqual(derivedKey, expectedKey)
}