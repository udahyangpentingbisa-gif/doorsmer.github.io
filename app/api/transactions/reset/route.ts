import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { transactions } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/server/auth'

export async function POST() {
  try {
    await requireAdmin()
  } catch (response) {
    return response instanceof Response ? response : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await getDb().delete(transactions)
  return NextResponse.json({ reset: true })
}