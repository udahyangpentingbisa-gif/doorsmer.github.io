import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { ALL_PACKAGES } from '@/lib/data'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required to seed the database')
const requiredDatabaseUrl = databaseUrl

export async function seedPackages() {
  const sql = neon(requiredDatabaseUrl)

  for (const servicePackage of ALL_PACKAGES) {
    await sql`
      INSERT INTO service_packages (id, name, price, vehicle, duration, features, popular)
      VALUES (
        ${servicePackage.id},
        ${servicePackage.name},
        ${servicePackage.price},
        ${servicePackage.vehicle},
        ${servicePackage.duration},
        ${JSON.stringify(servicePackage.features)}::jsonb,
        ${servicePackage.popular ?? false}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        vehicle = EXCLUDED.vehicle,
        duration = EXCLUDED.duration,
        features = EXCLUDED.features,
        popular = EXCLUDED.popular,
        updated_at = now()
    `
  }

  console.log(`Seeded ${ALL_PACKAGES.length} service packages`)
}
