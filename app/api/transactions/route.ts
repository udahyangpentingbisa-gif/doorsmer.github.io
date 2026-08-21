import { desc, eq, gt, or } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { transactions } from '@/lib/db/schema'
import { isAdminAuthenticated } from '@/lib/server/auth'
import { parseNewTransaction } from '@/lib/server/transactions'

const QUEUE_EXPIRY_MS = 30 * 60 * 1000

function toTransaction(row: typeof transactions.$inferSelect) {
  return {
    id: row.id,
    customer: row.customer,
    phone: row.phone,
    vehicle: row.vehicle,
    plate: row.plate,
    packageId: row.packageId,
    packageName: row.packageName,
    price: row.price,
    status: row.status,
    payment: row.payment,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function GET() {
  try {
    const cutoff = new Date(Date.now() - QUEUE_EXPIRY_MS)
    const rows = await getDb()
      .select()
      .from(transactions)
      .where(or(eq(transactions.status, 'Selesai'), eq(transactions.status, 'Batal'), gt(transactions.createdAt, cutoff)))
      .orderBy(desc(transactions.createdAt))

    const admin = await isAdminAuthenticated()
    return NextResponse.json({
      transactions: rows.map((row) => {
        const transaction = toTransaction(row)
        return admin ? transaction : { ...transaction, customer: 'Pelanggan', phone: undefined }
      }),
    })
  } catch (error) {
    console.error('Failed to list transactions', error)
    return NextResponse.json({ error: 'Database belum dikonfigurasi.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const parsed = parseNewTransaction(await request.json().catch(() => null))
  if (!parsed) return NextResponse.json({ error: 'Data booking tidak valid.' }, { status: 400 })

  try {
    const [row] = await getDb()
      .insert(transactions)
      .values({
        id: sql`'TRX-' || nextval('transaction_number_seq')`,
        customer: parsed.customer,
        phone: parsed.phone,
        vehicle: parsed.vehicle,
        plate: parsed.plate,
        packageId: parsed.pkg.id,
        packageName: parsed.pkg.name,
        price: parsed.pkg.price,
        status: 'Diproses',
        payment: parsed.payment,
      })
      .returning()

    return NextResponse.json({ transaction: toTransaction(row) }, { status: 201 })
  } catch (error) {
    console.error('Failed to create transaction', error)
    return NextResponse.json({ error: 'Booking gagal disimpan.' }, { status: 503 })
  }
}