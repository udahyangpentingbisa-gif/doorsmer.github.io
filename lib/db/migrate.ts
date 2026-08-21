import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import * as schema from './schema'

export async function migrateDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL is required to migrate the database')

  const db = drizzle(neon(databaseUrl), { schema })
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Database migrations applied successfully')
}