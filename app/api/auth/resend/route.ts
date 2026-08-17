import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { ensureSchema } from '@/lib/schema'
import { normalizeEmail } from '@/lib/auth'
import { clampStr, isEmail } from '@/lib/validation'
import { issueCode } from '@/lib/otp'
import { sendMail } from '@/lib/email'
import { verificationEmail, passwordResetEmail } from '@/lib/email-templates'

export async function POST(req: Request) {
  await ensureSchema()
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const email = normalizeEmail(clampStr(body.email, 160))
  const purpose = body.purpose === 'reset' ? 'reset' : 'verify'
  if (!isEmail(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })

  const rows = (await sql`SELECT name FROM users WHERE email = ${email} LIMIT 1`) as { name: string }[]
  if (!rows[0]) {
    // Avoid leaking which emails exist.
    return NextResponse.json({ ok: true })
  }

  const issued = await issueCode(email, purpose)
  if (!issued.ok) return NextResponse.json({ error: issued.error }, { status: 429 })

  const tpl = purpose === 'reset' ? passwordResetEmail(rows[0].name, issued.code!) : verificationEmail(rows[0].name, issued.code!)
  const mail = await sendMail(email, tpl.subject, tpl.html)
  if (!mail.ok) return NextResponse.json({ error: 'Could not send email. Try again shortly.' }, { status: 502 })

  return NextResponse.json({ ok: true })
}
