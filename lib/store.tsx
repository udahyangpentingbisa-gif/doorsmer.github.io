'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  getPackageById,
  type PaymentMethod,
  type Transaction,
  type TxStatus,
  type VehicleType,
} from '@/lib/data'

type NewBooking = {
  customer: string
  phone: string
  vehicle: VehicleType
  plate: string
  packageId: string
  payment: PaymentMethod
}

type TransactionsContextValue = {
  transactions: Transaction[]
  loading: boolean
  addTransaction: (data: NewBooking) => Promise<Transaction>
  updateStatus: (id: string, status: TxStatus) => Promise<void>
  resetTransactions: () => Promise<void>
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null)

async function requestTransactions() {
  const response = await fetch('/api/transactions', { cache: 'no-store' })
  if (!response.ok) throw new Error('Gagal memuat transaksi')
  const body = (await response.json()) as { transactions: Transaction[] }
  return body.transactions
}

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    requestTransactions()
      .then((next) => {
        if (active) setTransactions(next)
      })
      .catch(() => {
        if (active) setTransactions([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    const interval = window.setInterval(() => {
      requestTransactions()
        .then((next) => {
          if (active) setTransactions(next)
        })
        .catch(() => undefined)
    }, 30_000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  const addTransaction = useCallback(async (data: NewBooking) => {
    const pkg = getPackageById(data.packageId)
    if (!pkg) throw new Error('Paket layanan tidak ditemukan')
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Booking gagal disimpan')
    const body = (await response.json()) as { transaction: Transaction }
    setTransactions((prev) => [body.transaction, ...prev])
    return body.transaction
  }, [])

  const updateStatus = useCallback(async (id: string, status: TxStatus) => {
    const response = await fetch(`/api/transactions/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error('Status transaksi gagal diperbarui')
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...transaction, status } : transaction,
      ),
    )
  }, [])

  const resetTransactions = useCallback(async () => {
    const response = await fetch('/api/transactions/reset', { method: 'POST' })
    if (!response.ok) throw new Error('Transaksi gagal direset')
    setTransactions([])
  }, [])

  const value = useMemo(
    () => ({ transactions, loading, addTransaction, updateStatus, resetTransactions }),
    [transactions, loading, addTransaction, updateStatus, resetTransactions],
  )

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext)
  if (!ctx) {
    throw new Error('useTransactions must be used within TransactionsProvider')
  }
  return ctx
}
