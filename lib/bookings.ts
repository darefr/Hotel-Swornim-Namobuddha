import 'server-only'
import { sql } from './db'
import { HOTEL } from './hotel'

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = new Date(checkIn + 'T00:00:00Z')
  const b = new Date(checkOut + 'T00:00:00Z')
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function generateReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `TKP-${s}`
}

export function priceBreakdown(roomPrice: number, nights: number, discountPct = 0) {
  const roomTotal = roomPrice * nights
  const discount = Math.round(roomTotal * (discountPct / 100) * 100) / 100
  const discounted = roomTotal - discount
  const tax = Math.round(discounted * HOTEL.taxRate * 100) / 100
  const service = Math.round(discounted * HOTEL.serviceRate * 100) / 100
  const total = Math.round((discounted + tax + service) * 100) / 100
  return { roomTotal, discount, tax, service, total }
}

// Count overlapping active bookings for a room in a date range (server-side availability).
export async function bookedUnits(roomId: string, checkIn: string, checkOut: string, excludeId?: string) {
  const rows = (await sql`
    SELECT COUNT(*)::int AS count FROM bookings
    WHERE room_id = ${roomId}
      AND status IN ('pending','confirmed','checked_in')
      AND check_in < ${checkOut}
      AND check_out > ${checkIn}
      ${excludeId ? sql`AND id <> ${excludeId}` : sql``}
  `) as { count: number }[]
  return rows[0]?.count ?? 0
}

export async function isRoomAvailable(roomId: string, totalUnits: number, checkIn: string, checkOut: string, excludeId?: string) {
  const booked = await bookedUnits(roomId, checkIn, checkOut, excludeId)
  return booked < totalUnits
}

export function tierForPoints(points: number) {
  if (points >= 5000) return 'Summit'
  if (points >= 2000) return 'Alpine'
  if (points >= 500) return 'Ascent'
  return 'Explorer'
}
