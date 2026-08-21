import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

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