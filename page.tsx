import { BookingForm } from '@/components/public/booking-form'
import { HeroSection } from '@/components/public/hero-section'
import {
  LocationSection,
  SiteFooter,
} from '@/components/public/location-section'
import { PricingSection } from '@/components/public/pricing-section'
import { QueueStatus } from '@/components/public/queue-status'
import { SiteNavbar } from '@/components/public/site-navbar'

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <SiteNavbar />
      <HeroSection />
      <PricingSection />

      <section
        id="booking"
        className="relative overflow-hidden border-y border-border/60 bg-card/30"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Booking &amp; Antrean Online
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Isi data kendaraan Anda, pilih waktu, dan pantau posisi antrean
              secara langsung.
            </p>
          </div>

          <div
            id="antrean"
            className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]"
          >
            <BookingForm />
            <QueueStatus />
          </div>
        </div>
      </section>

      <LocationSection />
      <SiteFooter />
    </main>
  )
}
