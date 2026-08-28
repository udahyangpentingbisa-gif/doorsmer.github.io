import { promisify } from 'node:util'
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

const scryptAsync = promisify(scrypt)

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  return `scrypt:${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [, salt, key] = storedHash.split(':')
  if (!salt || !key) return false

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  const expectedKey = Buffer.from(key, 'hex')
  return derivedKey.length === expectedKey.length && timingSafeEqual(derivedKey, expectedKey)
}