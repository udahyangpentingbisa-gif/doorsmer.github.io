import {
  Bike,
  Car,
  CircleCheckBig,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { formatRupiah, type Transaction } from '@/lib/data'

export function StatCards({
  transactions,
  rangeLabel,
}: {
  transactions: Transaction[]
  rangeLabel: string
}) {
  const motorCount = transactions.filter((t) => t.vehicle === 'Motor').length
  const mobilCount = transactions.filter((t) => t.vehicle === 'Mobil').length
  const totalUnit = transactions.length
  const done = transactions.filter((t) => t.status === 'Selesai')
  const revenue = done.reduce((sum, t) => sum + t.price, 0)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Unit Masuk</p>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <TrendingUp className="size-4" />
          </span>
        </div>
        <p className="mt-3 font-mono text-3xl font-bold">{totalUnit}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Bike className="size-3.5 text-primary" /> {motorCount} Motor
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Car className="size-3.5 text-primary" /> {mobilCount} Mobil
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Transaksi Selesai</p>
          <span className="flex size-9 items-center justify-center rounded-xl bg-success/15 text-success">
            <CircleCheckBig className="size-4" />
          </span>
        </div>
        <p className="mt-3 font-mono text-3xl font-bold">{done.length}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          dari {totalUnit} unit ({rangeLabel})
        </p>
      </div>

      <div className="rounded-2xl border border-primary/40 bg-card p-5 glow-cyan sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Pendapatan</p>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Wallet className="size-4" />
          </span>
        </div>
        <p className="mt-3 font-mono text-3xl font-bold text-primary">
          {formatRupiah(revenue)}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Otomatis dari transaksi selesai
        </p>
      </div>
    </div>
  )
}
