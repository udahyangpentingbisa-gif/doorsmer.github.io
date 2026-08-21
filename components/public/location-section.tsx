import { Clock, Droplets, MapPin, Phone } from 'lucide-react'

const HOURS = [
  { day: 'Senin – Jumat', time: '08.00 – 18.00' },
  { day: 'Sabtu – Minggu', time: '08.00 – 18.00' },
  { day: 'Hari Libur Nasional', time: '08.00 – 18.00' },
]

const ADMIN_WA_NUMBER = '6281263308881'
const ADMIN_WA_DISPLAY = '0812 6330 8881'
const WA_LINK = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(
  'Halo Admin BogelWash, saya ingin bertanya tentang layanan cuci kendaraan.',
)}`

export function LocationSection() {
  return (
    <section id="lokasi" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Lokasi &amp; Kontak
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Kunjungi outlet kami atau hubungi langsung via WhatsApp untuk
          pertanyaan dan reservasi cepat.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <iframe
            title="Lokasi BogelWash"
            src="https://www.google.com/maps?q=Jl.%20Jati%20II%20No.24,%20Medan%20Kota,%20Sumatera%20Utara%2020217&output=embed"
            className="h-80 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <MapPin className="size-5" />
            </span>
            <div>
              <h3 className="font-semibold">Alamat Outlet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Jl. Jati II No.24, Teladan Tim., Kec. Medan Kota, Kota Medan,
                Sumatera Utara 20217
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Clock className="size-5" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold">Jam Operasional</h3>
              <ul className="mt-2 flex flex-col gap-1.5">
                {HOURS.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="font-mono font-medium">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-primary/40 bg-card p-5 glow-cyan">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Phone className="size-5" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold">Hubungi Kami</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Admin: {ADMIN_WA_DISPLAY}
              </p>
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Phone className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Droplets className="size-4" />
          </span>
          <span className="font-semibold">
            Bogel<span className="text-primary">Wash</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BogelWash. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  )
}
