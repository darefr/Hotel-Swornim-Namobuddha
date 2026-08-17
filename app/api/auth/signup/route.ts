import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { ensureSchema } from '@/lib/schema'
import { hashPassword, normalizeEmail } from '@/lib/auth'
import { isEmail, isNonEmpty, isStrongEnough, clampStr } from '@/lib/validation'
import { issueCode } from '@/lib/otp'
import { sendMail } from '@/lib/email'
import { verificationEmail } from '@/lib/email-templates'

export async function POST(req: Request) {
  await ensureSchema()
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const name = clampStr(body.name, 120)
  const email = normalizeEmail(clampStr(body.email, 160))
  const phone = clampStr(body.phone, 40)
  const password = typeof body.password === 'string' ? body.password : ''

  if (!isNonEmpty(name)) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  if (!isEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  if (!isStrongEnough(password)) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

  const existing = (await sql`SELECT id, email_verified FROM users WHERE email = ${email} LIMIT 1`) as {
    id: string
    email_verified: boolean
  }[]

  if (existing[0]?.email_verified) {
    return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 })
  }

  const hash = await hashPassword(password)

  if (existing[0] && !existing[0].email_verified) {
    // Update the unverified account (allow re-registration before verification).
    await sql`UPDATE users SET name = ${name}, phone = ${phone || null}, password_hash = ${hash} WHERE id = ${existing[0].id}`
  } else {
    await sql`
      INSERT INTO users (name, email, phone, password_hash, role, email_verified)
      VALUES (${name}, ${email}, ${phone || null}, ${hash}, 'guest', false)
    `
  }

  const issued = await issueCode(email, 'verify')
  if (!issued.ok) return NextResponse.json({ error: issued.error }, { status: 429 })

  const tpl = verificationEmail(name, issued.code!)
  const mail = await sendMail(email, tpl.subject, tpl.html)
  if (!mail.ok) {
    return NextResponse.json({ error: 'We could not send the verification email. Please try again shortly.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, email })
}
