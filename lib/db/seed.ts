import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { ALL_PACKAGES } from '@/lib/data'

config({ path: '.env.local' })

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

  await sql`
    UPDATE transactions
    SET
      package_id = 'mobil-kecil',
      package_name = 'Cuci Mobil Kecil',
      price = 40000,
      updated_at = now()
    WHERE package_id = 'mobil-standar'
  `

  await sql`
    DELETE FROM service_packages
    WHERE id = 'mobil-standar'
  `

  console.log(`Seeded ${ALL_PACKAGES.length} service packages`)
}
