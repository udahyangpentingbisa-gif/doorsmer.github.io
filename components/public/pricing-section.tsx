'use client'

import { useState } from 'react'
import { Bike, Car, Check, Clock } from 'lucide-react'
import {
  MOBIL_PACKAGES,
  MOTOR_PACKAGES,
  formatRupiah,
  type ServicePackage,
  type VehicleType,
} from '@/lib/data'

function PriceCard({ pkg }: { pkg: ServicePackage }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-card p-6 transition hover:-translate-y-1 ${
        pkg.popular
          ? 'border-primary/50 glow-cyan'
          : 'border-border hover:border-primary/30'
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Terpopuler
        </span>
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {pkg.duration}
        </span>
      </div>

      <p className="mt-4 font-mono text-3xl font-bold text-primary">
        {formatRupiah(pkg.price)}
      </p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="#booking"
        className={`mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          pkg.popular
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'border border-border hover:bg-secondary'
        }`}
      >
        Pilih Paket
      </a>
    </div>
  )
}

export function PricingSection() {
  const [tab, setTab] = useState<VehicleType>('Motor')
  const packages = tab === 'Motor' ? MOTOR_PACKAGES : MOBIL_PACKAGES

  return (
    <section id="layanan" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Layanan &amp; Harga
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Pilih paket sesuai kendaraan dan kebutuhan Anda. Harga transparan,
          tanpa biaya tersembunyi.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-xl border border-border bg-card p-1">
          {(['Motor', 'Mobil'] as VehicleType[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTab(v)}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                tab === v
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {v === 'Motor' ? (
                <Bike className="size-4" />
              ) : (
                <Car className="size-4" />
              )}
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
        {packages.map((pkg) => (
          <PriceCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  )
}
