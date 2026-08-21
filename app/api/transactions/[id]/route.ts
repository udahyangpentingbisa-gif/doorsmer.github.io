import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { transactions } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/server/auth'
import { isTxStatus } from '@/lib/server/transactions'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin()
  } catch (response) {
    return response instanceof Response ? response : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!isTxStatus(body?.status)) {
    return NextResponse.json({ error: 'Status tidak valid.' }, { status: 400 })
  }

  const { id } = await context.params
  const [row] = await getDb()
    .update(transactions)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(transactions.id, id))
    .returning()

  if (!row) return NextResponse.json({ error: 'Transaksi tidak ditemukan.' }, { status: 404 })
  return NextResponse.json({ transaction: row })
}