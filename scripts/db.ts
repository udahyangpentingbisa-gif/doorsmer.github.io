import { migrateDatabase } from '@/lib/db/migrate'
import { seedPackages } from '@/lib/db/seed'

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

  throw new Error('Usage: pnpm db migrate | pnpm db seed')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})