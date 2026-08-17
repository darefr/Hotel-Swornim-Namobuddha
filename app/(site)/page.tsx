import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Utensils, Mountain, Sparkles, Quote } from 'lucide-react'
import { Hero } from '@/components/home/hero'
import { SectionHeading } from '@/components/site/section-heading'
import { RoomCard } from '@/components/site/room-card'
import { StarRating } from '@/components/site/star-rating'
import { Reveal } from '@/components/site/reveal'
import { getFeaturedRooms, getApprovedReviews, getReviewStats, getExperiences } from '@/lib/queries'
import { HOTEL } from '@/lib/hotel'

export default async function HomePage() {
  const [rooms, reviews, stats, experiences] = await Promise.all([
    getFeaturedRooms(),
    getApprovedReviews(3),
    getReviewStats(),
    getExperiences(),
  ])

  return (
    <>
      <Hero rating={stats.avg || 5} reviewCount={stats.count} />

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Welcome to Tukuche Peak</p>
            <h2 className="text-balance font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              A sanctuary carved into the world&apos;s deepest valley
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
              Perched in the heart of Mustang on the ancient salt-trade route, Hotel Tukuche Peak blends floor-to-ceiling
              glass architecture with the timeless craft of the Thakali people. Wake to alpenglow on Dhaulagiri, dine on
              mountain-grown cuisine, and rest in rooms designed for deep, quiet luxury.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Explore rooms <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/experiences"
                className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold transition-colors hover:text-accent"
              >
                Our experiences
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-3xl">
              <Image src="/images/gallery/lounge.png" alt="The glass lounge" fill sizes="25vw" className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
              <Image src="/images/gallery/valley.png" alt="The Kali Gandaki valley" fill sizes="25vw" className="object-cover" />
            </div>
          </Reveal>
        </div>

        {/* Stat strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['2,590 m', 'Above sea level'],
            [`${stats.avg ? stats.avg.toFixed(1) : '5.0'} ★`, 'Guest rating'],
            ['4', 'Signature room types'],
            ['24/7', 'AI + human concierge'],
          ].map(([big, small], i) => (
            <Reveal key={small} delay={i * 0.08} className="glass glass-reflect rounded-2xl p-5 text-center">
              <p className="font-serif text-2xl font-semibold text-accent sm:text-3xl">{big}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{small}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured rooms */}
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Rooms & Suites"
            title="Rest at the roof of the world"
            description="Each room frames the Himalaya through floor-to-ceiling glass, with heated floors, alpine linens and quiet, considered luxury."
          />
          <Link href="/rooms" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
            View all rooms <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} />
          ))}
        </div>
      </section>

      {/* Experience / dining split */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="group relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
              <Image src="/images/gallery/dining.png" alt="Alpine dining room" fill sizes="50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7">
              <Utensils className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-serif text-2xl font-semibold text-white">The Restaurant</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                Thakali signatures and alpine cuisine, served beneath the peaks with produce from the valley&apos;s
                orchards.
              </p>
              <Link href="/restaurant" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-accent">
                Discover dining <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={0.1} className="glass glass-reflect rounded-3xl p-7">
              <Sparkles className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-serif text-2xl font-semibold">Your personal concierge</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Plan your entire stay in seconds. Our AI concierge knows every room, dish and trail — and our team is
                always a message away on WhatsApp.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="group relative overflow-hidden rounded-3xl">
              <div className="relative aspect-[16/10]">
                <Image src="/images/gallery/terrace.png" alt="Mountain-view terrace" fill sizes="50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7">
                <Mountain className="h-6 w-6 text-accent" />
                <h3 className="mt-3 font-serif text-2xl font-semibold text-white">Guided experiences</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                  {experiences.length}+ curated adventures — from sunrise over Dhaulagiri to the famed apple-brandy
                  distilleries of Marpha.
                </p>
                <Link href="/experiences" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-accent">
                  Explore experiences <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-8">
          <SectionHeading align="center" eyebrow="Guest stories" title="Loved by travellers from around the world" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.1} className="glass glass-reflect flex flex-col rounded-3xl p-6">
                <Quote className="h-7 w-7 text-accent/60" />
                <StarRating value={r.rating} className="mt-3" />
                <h3 className="mt-3 font-serif text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                <p className="mt-4 text-sm font-medium">— {r.guest_name}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
              Read all reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <Reveal className="relative overflow-hidden rounded-[2rem]">
          <div className="relative aspect-[16/10] sm:aspect-[21/9]">
            <Image src="/images/gallery/exterior-dusk.png" alt="Hotel Tukuche Peak at dusk" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="max-w-2xl text-balance font-serif text-3xl font-semibold text-white sm:text-5xl">
              Your Himalayan escape awaits
            </h2>
            <p className="mt-4 max-w-lg text-pretty text-white/80">
              Reserve your stay at {HOTEL.name} and wake to the mountains that changed everything.
            </p>
            <Link
              href="/booking"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
            >
              Book your stay <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
