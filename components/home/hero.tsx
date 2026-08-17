'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { BookingWidget } from '@/components/site/booking-widget'
import { HOTEL } from '@/lib/hotel'

export function Hero({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt="Hotel Tukuche Peak at golden hour beneath the Dhaulagiri Himalaya"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-5 pb-8 pt-28 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass-strong px-4 py-1.5 text-xs font-medium text-white">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {HOTEL.location} · {HOTEL.altitude}
          </div>
          <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Where the Himalaya <span className="italic text-gradient-gold">meets stillness</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
            A boutique luxury retreat above the clouds in Tukuche — cinematic mountain views, refined alpine design, and
            the warm soul of Thakali hospitality.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <BookingWidget />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70"
        >
          <span>
            <strong className="text-white">{rating.toFixed(1)}</strong> ★ from {reviewCount} guest reviews
          </span>
          <span className="hidden h-4 w-px bg-white/30 sm:block" />
          <span>Annapurna Circuit · Mustang</span>
        </motion.div>
      </div>
    </section>
  )
}
