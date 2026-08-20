'use client'

import { useMemo, useState } from 'react'
import { CalendarClock, CheckCircle2, Loader2, Wallet } from 'lucide-react'
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
const labelCls = 'mb-1.5 block text-sm font-medium text-foreground'

export function BookingForm() {
  const { addTransaction } = useTransactions()
  const [vehicle, setVehicle] = useState<VehicleType>('Motor')
  const [packageId, setPackageId] = useState('motor-kecil')
  const [payment, setPayment] = useState<PaymentMethod>('Tunai')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const packages = vehicle === 'Motor' ? MOTOR_PACKAGES : MOBIL_PACKAGES
  const selected = useMemo(
    () => packages.find((p) => p.id === packageId),
    [packages, packageId],
  )

  function onVehicleChange(v: VehicleType) {
    setVehicle(v)
    setPackageId(v === 'Motor' ? 'motor-kecil' : 'mobil-standar')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setSubmitting(true)

    // Simulate a short network delay for prototype feedback
    setTimeout(() => {
      const tx = addTransaction({
        customer: String(data.get('customer') || ''),
        phone: String(data.get('phone') || ''),
        vehicle,
        plate: String(data.get('plate') || ''),
        packageId,
        payment,
      })
      setSubmitting(false)
      setSuccess(tx.id)
      form.reset()
    }, 700)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-primary/40 bg-card p-8 text-center glow-cyan">
        <CheckCircle2 className="size-14 text-primary" />
        <h3 className="mt-4 text-xl font-semibold">Booking Berhasil!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Nomor antrean Anda:{' '}
          <span className="font-mono font-semibold text-primary">
            {success}
          </span>
          . Kendaraan Anda masuk daftar antrean dan sedang menunggu diproses.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Buat Booking Lagi
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="customer" className={labelCls}>
            Nama Lengkap
          </label>
          <input
            id="customer"
            name="customer"
            required
            placeholder="cth. Budi Santoso"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            No. HP / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            required
            inputMode="tel"
            placeholder="cth. 0812-3456-7890"
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
          <label htmlFor="plate" className={labelCls}>
            Plat Nomor
          </label>
          <input
            id="plate"
            name="plate"
            required
            placeholder="cth. B 1234 CD"
            className={`${inputCls} uppercase`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="package" className={labelCls}>
            Pilihan Layanan
          </label>
          <select
            id="package"
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

        <div className="sm:col-span-2">
          <label className={labelCls}>
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="size-4 text-primary" />
              Metode Pembayaran
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPayment(m)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  payment === m
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={payment === m}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="date" className={labelCls}>
            Tanggal
          </label>
          <input id="date" name="date" type="date" required className={inputCls} />
        </div>
        <div>
          <label htmlFor="time" className={labelCls}>
            Jam
          </label>
          <input id="time" name="time" type="time" required className={inputCls} />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarClock className="size-4 text-primary" />
          Estimasi pengerjaan {selected?.duration}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Estimasi</p>
          <p className="font-mono text-xl font-bold text-primary">
            {formatRupiah(selected?.price ?? 0)}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 glow-cyan"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Memproses...
          </>
        ) : (
          'Konfirmasi Booking'
        )}
      </button>
    </form>
  )
}
