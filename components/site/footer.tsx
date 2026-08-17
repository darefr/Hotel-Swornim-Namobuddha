import Link from 'next/link'
import { Mountain, MapPin, Phone, Mail, Camera, Globe } from 'lucide-react'
import { HOTEL, whatsappLink } from '@/lib/hotel'

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Mountain className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-[15px] font-semibold">Tukuche Peak</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Himalayan Hotel</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              {HOTEL.tagline}. A boutique retreat on the Annapurna circuit in {HOTEL.location}.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['/rooms', 'Rooms & Suites'],
                ['/restaurant', 'Restaurant'],
                ['/experiences', 'Experiences'],
                ['/offers', 'Offers'],
                ['/gallery', 'Gallery'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-foreground/80 transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Guests</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['/booking', 'Book a stay'],
                ['/account', 'My account'],
                ['/login', 'Sign in'],
                ['/reviews', 'Reviews'],
                ['/contact', 'Contact us'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-foreground/80 transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-foreground/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{HOTEL.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href={whatsappLink()} className="text-foreground/80 transition-colors hover:text-accent">
                  {HOTEL.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${HOTEL.email}`} className="text-foreground/80 transition-colors hover:text-accent">
                  {HOTEL.email}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a
                href={HOTEL.social.instagram}
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl glass text-foreground/80 transition-colors hover:text-accent"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                href={HOTEL.social.facebook}
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl glass text-foreground/80 transition-colors hover:text-accent"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {HOTEL.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-accent">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-accent">Terms</Link>
            <Link href="/admin/login" className="transition-colors hover:text-accent">Staff</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
