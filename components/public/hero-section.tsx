import Image from 'next/image'
import { ArrowRight, Bike, Car, Sparkles, Star } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Detailing & Nano Coating Premium
          </span>

          <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Kilau Sempurna dari BogelWash untuk{' '}
            <span className="text-primary text-glow">Motor &amp; Mobil</span>{' '}
            Kesayangan Anda
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Teknologi cuci modern dengan air bertekanan, foam premium, dan
            lapisan hydrophobic. Pesan antrean online, pantau statusnya secara
            real-time, tanpa antre berlama-lama.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#booking"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 glow-cyan-strong"
            >
              Booking Sekarang
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#layanan"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3.5 text-sm font-semibold transition hover:bg-secondary"
            >
              Lihat Layanan &amp; Harga
            </a>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { label: 'Unit / hari', value: '120+' },
              { label: 'Rating', value: '4.9', icon: true },
              { label: 'Cabang', value: '3' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card/50 p-4"
              >
                <dd className="flex items-center gap-1 font-mono text-2xl font-bold text-foreground">
                  {stat.value}
                  {stat.icon && (
                    <Star className="size-4 fill-primary text-primary" />
                  )}
                </dd>
                <dt className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-primary/20 glow-cyan animate-float-slow">
            <Image
              src="/hero-wash.png"
              alt="Mobil premium sedang dicuci dengan efek air glossy dan cahaya neon sian"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-4 backdrop-blur-md glow-cyan">
            <div className="flex -space-x-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Car className="size-4" />
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary ring-2 ring-card">
                <Bike className="size-4" />
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold">Motor &amp; Mobil</p>
              <p className="text-xs text-muted-foreground">
                Semua tipe kendaraan
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
