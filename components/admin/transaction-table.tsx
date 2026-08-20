'use client'

import { Bike, Car } from 'lucide-react'
import {
  formatRupiah,
  type Transaction,
  type TxStatus,
} from '@/lib/data'
import { useTransactions } from '@/lib/store'

const STATUS_STYLES: Record<TxStatus, string> = {
  Diproses: 'bg-warning/15 text-warning border-warning/30',
  Selesai: 'bg-success/15 text-success border-success/30',
  Batal: 'bg-destructive/15 text-destructive border-destructive/30',
}

const STATUS_OPTIONS: TxStatus[] = ['Diproses', 'Selesai', 'Batal']

export function TransactionTable({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const { updateStatus } = useTransactions()

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">No</th>
              <th className="px-4 py-3 font-medium">Pelanggan</th>
              <th className="px-4 py-3 font-medium">Kendaraan</th>
              <th className="px-4 py-3 font-medium">Plat Nomor</th>
              <th className="px-4 py-3 font-medium">Paket</th>
              <th className="px-4 py-3 font-medium">Harga</th>
              <th className="px-4 py-3 font-medium">Pembayaran</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Tidak ada transaksi pada rentang waktu ini.
                </td>
              </tr>
            )}
            {transactions.map((t, i) => (
              <tr
                key={t.id}
                className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30"
              >
                <td className="px-4 py-3 font-mono text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{t.customer}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {t.id}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    {t.vehicle === 'Motor' ? (
                      <Bike className="size-4 text-primary" />
                    ) : (
                      <Car className="size-4 text-primary" />
                    )}
                    {t.vehicle}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">{t.plate}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {t.packageName}
                </td>
                <td className="px-4 py-3 font-mono font-medium">
                  {formatRupiah(t.price)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {t.payment}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[t.status]}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <select
                      value={t.status}
                      onChange={(e) =>
                        updateStatus(t.id, e.target.value as TxStatus)
                      }
                      aria-label={`Ubah status ${t.id}`}
                      className="rounded-lg border border-input bg-secondary/40 px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
