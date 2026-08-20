'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  SEED_TRANSACTIONS,
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
  addTransaction: (data: NewBooking) => Transaction
  updateStatus: (id: string, status: TxStatus) => void
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null)

let counter = 1043

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(SEED_TRANSACTIONS)

  const addTransaction = useCallback((data: NewBooking) => {
    const pkg = getPackageById(data.packageId)
    const tx: Transaction = {
      id: `TRX-${counter++}`,
      customer: data.customer,
      phone: data.phone,
      vehicle: data.vehicle,
      plate: data.plate.toUpperCase(),
      packageId: data.packageId,
      packageName: pkg?.name ?? 'Custom',
      price: pkg?.price ?? 0,
      status: 'Diproses',
      payment: data.payment,
      createdAt: new Date().toISOString(),
    }
    setTransactions((prev) => [tx, ...prev])
    return tx
  }, [])

  const updateStatus = useCallback((id: string, status: TxStatus) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    )
  }, [])

  const value = useMemo(
    () => ({ transactions, addTransaction, updateStatus }),
    [transactions, addTransaction, updateStatus],
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
