import 'server-only'
import { sql } from './db'
import { ensureSchema } from './schema'

export type Room = {
  id: string
  slug: string
  name: string
  description: string
  long_description: string
  price: number
  capacity: number
  size_sqm: number
  beds: string
  total_units: number
  amenities: string[]
  images: string[]
  featured: boolean
  status: string
}

export type Review = {
  id: string
  guest_name: string
  rating: number
  title: string
  body: string
  status: string
  reply: string | null
  created_at: string
}

function normRoom(r: Record<string, unknown>): Room {
  return {
    ...(r as Room),
    price: Number(r.price),
    amenities: Array.isArray(r.amenities) ? (r.amenities as string[]) : [],
    images: Array.isArray(r.images) ? (r.images as string[]) : [],
  }
}

export async function getRooms(): Promise<Room[]> {
  await ensureSchema()
  const rows = (await sql`SELECT * FROM rooms WHERE status = 'active' ORDER BY sort, price`) as Record<string, unknown>[]
  return rows.map(normRoom)
}

export async function getFeaturedRooms(): Promise<Room[]> {
  const rooms = await getRooms()
  return rooms.filter((r) => r.featured)
}

export async function getRoom(slug: string): Promise<Room | null> {
  await ensureSchema()
  const rows = (await sql`SELECT * FROM rooms WHERE slug = ${slug} LIMIT 1`) as Record<string, unknown>[]
  return rows[0] ? normRoom(rows[0]) : null
}

export async function getApprovedReviews(limit = 12): Promise<Review[]> {
  await ensureSchema()
  const rows = (await sql`
    SELECT id, guest_name, rating, title, body, status, reply, created_at
    FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT ${limit}
  `) as Review[]
  return rows
}

export async function getOffers() {
  await ensureSchema()
  return (await sql`SELECT * FROM offers WHERE active = true ORDER BY created_at DESC`) as Record<string, unknown>[]
}

export async function getMenu() {
  await ensureSchema()
  const cats = (await sql`SELECT * FROM menu_categories ORDER BY sort`) as { id: string; name: string }[]
  const items = (await sql`SELECT * FROM menu_items WHERE available = true ORDER BY sort`) as Record<string, unknown>[]
  return cats.map((c) => ({
    ...c,
    items: items.filter((i) => i.category_id === c.id).map((i) => ({ ...i, price: Number(i.price) })),
  }))
}

export async function getExperiences() {
  await ensureSchema()
  return (await sql`SELECT * FROM experiences ORDER BY sort`) as Record<string, unknown>[]
}

export async function getGallery() {
  await ensureSchema()
  return (await sql`SELECT * FROM gallery ORDER BY sort`) as Record<string, unknown>[]
}

export async function getFaqs() {
  await ensureSchema()
  return (await sql`SELECT * FROM faqs ORDER BY sort`) as { id: string; question: string; answer: string; category: string }[]
}

export async function getReviewStats() {
  await ensureSchema()
  const rows = (await sql`
    SELECT COUNT(*)::int AS count, COALESCE(AVG(rating),0)::float AS avg
    FROM reviews WHERE status = 'approved'
  `) as { count: number; avg: number }[]
  return rows[0] || { count: 0, avg: 0 }
}
