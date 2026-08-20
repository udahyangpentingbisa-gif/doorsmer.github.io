'use client'

import { Bike, Car, Loader2 } from 'lucide-react'
import { useTransactions } from '@/lib/store'

export function QueueStatus() {
  const { transactions } = useTransactions()

  const processing = transactions.filter((t) => t.status === 'Diproses')
  const current = processing[0]
  const waiting = processing.slice(1, 5)

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <h3 className="font-semibold">Antrean Real-time</h3>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          {processing.length} dalam antrean
        </span>
      </div>

      {current ? (
        <div className="mt-6 rounded-2xl border border-primary/40 bg-primary/5 p-5 glow-cyan">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Sedang Diproses
          </p>
          <div className="mt-3 flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary animate-pulse-ring">
              {current.vehicle === 'Motor' ? (
                <Bike className="size-6" />
              ) : (
                <Car className="size-6" />
              )}
            </span>
            <div>
              <p className="font-mono text-lg font-bold">{current.plate}</p>
              <p className="text-sm text-muted-foreground">
                {current.vehicle} • {current.packageName}
              </p>
            </div>
            <Loader2 className="ml-auto size-5 animate-spin text-primary" />
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
          Tidak ada kendaraan yang sedang diproses.
        </div>
      )}

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Menunggu Giliran
      </p>
      <ul className="mt-3 flex flex-1 flex-col gap-2">
        {waiting.length > 0 ? (
          waiting.map((t, i) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 px-4 py-3"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-semibold">
                {i + 1}
              </span>
              {t.vehicle === 'Motor' ? (
                <Bike className="size-4 text-muted-foreground" />
              ) : (
                <Car className="size-4 text-muted-foreground" />
              )}
              <span className="font-mono text-sm">{t.plate}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {t.packageName}
              </span>
            </li>
          ))
        ) : (
          <li className="rounded-xl border border-dashed border-border px-4 py-3 text-center text-xs text-muted-foreground">
            Antrean kosong — giliran Anda bisa langsung!
          </li>
        )}
      </ul>
    </div>
  )
}
