'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, Droplets, KeyRound, LogOut, Plus, RotateCcw } from 'lucide-react'
import { useTransactions } from '@/lib/store'
import { StatCards } from '@/components/admin/stat-cards'
import { TransactionTable } from '@/components/admin/transaction-table'
import { AddTransactionDialog } from '@/components/admin/add-transaction-dialog'
import { ChangePasswordDialog } from '@/components/admin/change-password-dialog'

type Range = 'Harian' | 'Mingguan' | 'Bulanan'

const RANGES: Range[] = ['Harian', 'Mingguan', 'Bulanan']

function withinRange(createdAt: string, range: Range) {
  const now = new Date()
  const created = new Date(createdAt)
  const diffDays =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays < 0) return false
  if (range === 'Harian') {
    return created.toDateString() === now.toDateString()
  }
  if (range === 'Mingguan') return diffDays <= 7
  return diffDays <= 31
}

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { transactions, resetTransactions } = useTransactions()
  const [range, setRange] = useState<Range>('Harian')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  const filtered = useMemo(
    () => transactions.filter((t) => withinRange(t.createdAt, range)),
    [transactions, range],
  )

  function handleReset() {
    if (window.confirm('Reset semua transaksi dan pendapatan dashboard?')) {
      resetTransactions()
    }
  }

  return (
    <main className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary glow-cyan">
              <Droplets className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">
                BogelWash Admin
              </p>
              <p className="text-xs text-muted-foreground">
                Panel Antrean &amp; Transaksi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPasswordDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              <KeyRound className="size-4" />
              <span className="hidden sm:inline">Ganti Password</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Kembali ke Situs</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ringkasan performa &amp; antrean laundry kendaraan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl border border-border bg-card p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    range === r
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 glow-cyan"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Tambah Transaksi</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 px-4 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
            >
              <RotateCcw className="size-4" />
              <span className="hidden sm:inline">Reset Dashboard</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <StatCards transactions={filtered} rangeLabel={range} />
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Antrean &amp; Transaksi</h2>
            <span className="text-sm text-muted-foreground">
              {filtered.length} transaksi
            </span>
          </div>
          <TransactionTable transactions={filtered} />
        </div>
      </div>

      <AddTransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      />
    </main>
  )
}
