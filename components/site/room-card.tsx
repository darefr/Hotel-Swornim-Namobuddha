'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Maximize, BedDouble, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '@/lib/hotel'
import type { Room } from '@/lib/queries'

export function RoomCard({ room, index = 0 }: { room: Room; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group glass glass-reflect glass-hover overflow-hidden rounded-3xl hover:-translate-y-1 hover:shadow-xl"
    >
      <Link href={`/rooms/${room.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={room.images[0] || '/images/hero.png'}
            alt={`${room.name} at Hotel Tukuche Peak`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full glass-strong px-3 py-1 text-xs font-semibold">
            {formatCurrency(room.price)}
            <span className="font-normal text-muted-foreground"> / night</span>
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl font-semibold tracking-tight">{room.name}</h3>
            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{room.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-accent" /> {room.capacity} guests
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 text-accent" /> {room.beds}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize className="h-3.5 w-3.5 text-accent" /> {room.size_sqm} m²
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
