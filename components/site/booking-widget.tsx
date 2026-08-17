'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CalendarDays, Users, Search } from 'lucide-react'

function todayISO(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

export function BookingWidget({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState(todayISO(1))
  const [checkOut, setCheckOut] = useState(todayISO(3))
  const [guests, setGuests] = useState(2)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) })
    router.push(`/booking?${params.toString()}`)
  }

  return (
    <form
      onSubmit={submit}
      className={`glass-strong glass-reflect grid gap-3 rounded-2xl p-3 sm:p-4 ${
        compact ? 'sm:grid-cols-[1fr_1fr_auto_auto]' : 'sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]'
      }`}
    >
      <label className="flex flex-col gap-1.5 rounded-xl bg-background/40 px-3.5 py-2.5">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> Check in
        </span>
        <input
          type="date"
          value={checkIn}
          min={todayISO()}
          onChange={(e) => setCheckIn(e.target.value)}
          className="bg-transparent text-sm font-medium outline-none"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 rounded-xl bg-background/40 px-3.5 py-2.5">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> Check out
        </span>
        <input
          type="date"
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
          className="bg-transparent text-sm font-medium outline-none"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 rounded-xl bg-background/40 px-3.5 py-2.5">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> Guests
        </span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="bg-transparent text-sm font-medium outline-none [&>option]:text-foreground"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} className="bg-background">
              {n} {n === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
      >
        <Search className="h-4 w-4" />
        Check availability
      </button>
    </form>
  )
}
