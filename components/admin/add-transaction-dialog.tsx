'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import {
  MOBIL_PACKAGES,
  MOTOR_PACKAGES,
  PAYMENT_METHODS,
  formatRupiah,
  type PaymentMethod,
  type VehicleType,
} from '@/lib/data'
import { useTransactions } from '@/lib/store'

const inputCls =
  'mobile-readable-control w-full rounded-xl border border-input bg-secondary/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
const labelCls = 'mb-1.5 block text-sm font-medium'

export function AddTransactionDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { addTransaction } = useTransactions()
  const [vehicle, setVehicle] = useState<VehicleType>('Motor')
  const [packageId, setPackageId] = useState('motor-kecil')
  const [payment, setPayment] = useState<PaymentMethod>('Tunai')

  if (!open) return null

  const packages = vehicle === 'Motor' ? MOTOR_PACKAGES : MOBIL_PACKAGES

  function onVehicleChange(v: VehicleType) {
    setVehicle(v)
    setPackageId(v === 'Motor' ? 'motor-kecil' : 'mobil-standar')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    addTransaction({
      customer: String(data.get('customer') || 'Walk-in'),
      phone: '',
      vehicle,
      plate: String(data.get('plate') || ''),
      packageId,
      payment,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-tx-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 glow-cyan"
      >
        <div className="flex items-center justify-between">
          <h3 id="add-tx-title" className="text-lg font-semibold">
            Tambah Transaksi Manual
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Untuk pelanggan walk-in / pembayaran di tempat.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label htmlFor="m-customer" className={labelCls}>
              Nama Pelanggan
            </label>
            <input
              id="m-customer"
              name="customer"
              required
              placeholder="cth. Walk-in / Nama"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Jenis Kendaraan</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Motor', 'Mobil'] as VehicleType[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onVehicleChange(v)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    vehicle === v
                        ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input text-muted-foreground hover:text-foreground'
                  }`}
                    aria-pressed={vehicle === v}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="m-plate" className={labelCls}>
              Plat Nomor
            </label>
            <input
              id="m-plate"
              name="plate"
              required
              placeholder="cth. B 1234 CD"
              className={`${inputCls} uppercase`}
            />
          </div>

          <div>
            <label htmlFor="m-package" className={labelCls}>
              Paket Layanan
            </label>
            <select
              id="m-package"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              className={inputCls}
            >
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatRupiah(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="m-payment" className={labelCls}>
              Metode Pembayaran
            </label>
            <select
              id="m-payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value as PaymentMethod)}
              className={inputCls}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
