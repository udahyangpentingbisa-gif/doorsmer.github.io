import { migrateDatabase } from '@/lib/db/migrate'
import { seedPackages } from '@/lib/db/seed'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hashPassword } from '@/lib/server/password'

const command = process.argv[2]

async function main() {
  if (command === 'migrate') {
    await migrateDatabase()
    return
  }

  if (command === 'seed') {
    await seedPackages()
    return
  }

  if (command === 'bootstrap-admin') {
    const username = process.argv[3]?.trim()
    const password = process.argv[4]
    if (!username || !/^[a-zA-Z0-9._-]{3,50}$/.test(username) || !password || password.length < 8) {
      throw new Error('Usage: pnpm db bootstrap-admin <username> <password>')
    }

    const passwordHash = await hashPassword(password)
    await getDb()
      .insert(users)
      .values({ username, passwordHash, role: 'admin', active: true })
      .onConflictDoUpdate({
        target: users.username,
        set: { passwordHash, role: 'admin', active: true, updatedAt: new Date() },
      })
    console.log(`Admin user ${username} is ready`)
    return
  }

  throw new Error('Usage: pnpm db migrate | pnpm db seed | pnpm db bootstrap-admin <username> <password>')
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error(error.message)
    const databaseError = (error.cause ?? error) as Error & {
      code?: string
      detail?: string
      hint?: string
      constraint?: string
    }
    if (databaseError.message !== error.message) console.error(`Database error: ${databaseError.message}`)
    if (databaseError.code) console.error(`Database code: ${databaseError.code}`)
    if (databaseError.detail) console.error(`Database detail: ${databaseError.detail}`)
    if (databaseError.hint) console.error(`Database hint: ${databaseError.hint}`)
    if (databaseError.constraint) console.error(`Database constraint: ${databaseError.constraint}`)
  } else {
    console.error(error)
  }
  process.exitCode = 1
})