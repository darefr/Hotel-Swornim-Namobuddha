import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { ensureSchema } from '@/lib/schema'
import { normalizeEmail, createSession } from '@/lib/auth'
import { clampStr, isEmail } from '@/lib/validation'
import { checkCode } from '@/lib/otp'

export async function POST(req: Request) {
  await ensureSchema()
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const email = normalizeEmail(clampStr(body.email, 160))
  const code = clampStr(body.code, 6)
  if (!isEmail(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'Please enter the 6-digit code sent to your email.' }, { status: 400 })
  }

  const result = await checkCode(email, 'verify', code)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  const rows = (await sql`UPDATE users SET email_verified = true WHERE email = ${email} RETURNING id`) as { id: string }[]
  if (!rows[0]) return NextResponse.json({ error: 'Account not found.' }, { status: 404 })

  // Welcome loyalty points on verification.
  await sql`UPDATE users SET loyalty_points = loyalty_points + 100 WHERE id = ${rows[0].id}`
  await sql`INSERT INTO loyalty_transactions (user_id, points, reason) VALUES (${rows[0].id}, 100, 'Welcome bonus')`

  await createSession(rows[0].id, true)
  return NextResponse.json({ ok: true })
}
