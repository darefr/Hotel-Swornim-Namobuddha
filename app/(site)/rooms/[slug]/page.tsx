import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Users, Maximize, BedDouble, ArrowRight, MessageCircle } from 'lucide-react'
import { getRoom, getRooms } from '@/lib/queries'
import { formatCurrency, HOTEL, whatsappLink } from '@/lib/hotel'
import { RoomCard } from '@/components/site/room-card'

export async function generateStaticParams() {
  const rooms = await getRooms()
  return rooms.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const room = await getRoom(slug)
  if (!room) return { title: 'Room not found' }
  return {
    title: room.name,
    description: room.description,
    openGraph: { images: room.images.length ? [room.images[0]] : [] },
  }
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const room = await getRoom(slug)
  if (!room) notFound()

  const others = (await getRooms()).filter((r) => r.slug !== slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.description,
    image: room.images,
    occupancy: { '@type': 'QuantitativeValue', maxValue: room.capacity },
    offers: { '@type': 'Offer', price: room.price, priceCurrency: HOTEL.currency },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-24">
        {/* Gallery */}
        <section className="mx-auto max-w-6xl px-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-auto">
              <Image
                src={room.images[0] || '/images/hero.png'}
                alt={`${room.name} — main view`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-auto">
              <Image
                src={room.images[1] || room.images[0] || '/images/hero.png'}
                alt={`${room.name} — detail view`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Room & Suite</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{room.name}</h1>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" /> Up to {room.capacity} guests
                </span>
                <span className="flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-accent" /> {room.beds}
                </span>
                <span className="flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-accent" /> {room.size_sqm} m²
                </span>
              </div>

              <p className="mt-8 text-pretty text-lg leading-relaxed text-foreground/90">{room.long_description}</p>

              <h2 className="mt-10 font-serif text-2xl font-semibold">Amenities</h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Booking card */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass-strong glass-reflect rounded-3xl p-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-semibold">{formatCurrency(room.price)}</span>
                  <span className="text-sm text-muted-foreground">/ night</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Excludes {Math.round(HOTEL.taxRate * 100)}% VAT & {Math.round(HOTEL.serviceRate * 100)}% service
                </p>
                <Link
                  href={`/booking?room=${room.slug}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
                >
                  Book this room <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappLink(`Hello ${HOTEL.name}, I'd like to enquire about the ${room.name}.`)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl glass px-5 py-3.5 text-sm font-semibold transition-colors hover:text-accent"
                >
                  <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
                </a>
                <p className="mt-4 text-center text-xs text-muted-foreground">Free cancellation up to 7 days before arrival</p>
              </div>
            </aside>
          </div>
        </section>

        {/* Others */}
        {others.length > 0 && (
          <section className="mx-auto max-w-6xl px-5 py-8 pb-20">
            <h2 className="mb-8 font-serif text-2xl font-semibold">You may also like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((r, i) => (
                <RoomCard key={r.id} room={r} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
