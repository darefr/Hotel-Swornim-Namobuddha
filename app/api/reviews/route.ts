import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { ensureSchema } from '@/lib/schema'
import { getCurrentUser } from '@/lib/auth'
import { clampStr } from '@/lib/validation'

export async function POST(req: Request) {
  await ensureSchema()
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Please sign in to leave a review.' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const rating = Number(body.rating)
  const title = clampStr(body.title, 120)
  const reviewBody = clampStr(body.body, 3000)

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Please select a rating from 1 to 5 stars.' }, { status: 400 })
  }
  if (!title || !reviewBody) {
    return NextResponse.json({ error: 'Please add a title and your review.' }, { status: 400 })
  }

  // One editable review per guest: update if exists, else insert. New/edited reviews go back to pending.
  const existing = (await sql`SELECT id FROM reviews WHERE user_id = ${user.id} LIMIT 1`) as { id: string }[]
  if (existing[0]) {
    await sql`
      UPDATE reviews SET rating = ${rating}, title = ${title}, body = ${reviewBody}, status = 'pending', created_at = now()
      WHERE id = ${existing[0].id} AND user_id = ${user.id}
    `
  } else {
    await sql`
      INSERT INTO reviews (user_id, guest_name, rating, title, body, status)
      VALUES (${user.id}, ${user.name}, ${rating}, ${title}, ${reviewBody}, 'pending')
    `
    await sql`
      INSERT INTO notifications (audience, type, title, body)
      VALUES ('admin', 'review', 'New review awaiting moderation', ${`${user.name} left a ${rating}★ review`})
    `
  }

  return NextResponse.json({ ok: true, message: 'Thank you! Your review has been submitted for approval.' })
}

export async function GET() {
  await ensureSchema()
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ review: null })
  const rows = (await sql`
    SELECT id, rating, title, body, status, reply, created_at FROM reviews WHERE user_id = ${user.id} LIMIT 1
  `) as Record<string, unknown>[]
  return NextResponse.json({ review: rows[0] || null })
}
