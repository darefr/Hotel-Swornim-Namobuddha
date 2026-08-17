import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { ensureSchema } from '@/lib/schema'
import { normalizeEmail, verifyPassword, createSession } from '@/lib/auth'
import { clampStr, isEmail } from '@/lib/validation'
import { issueCode } from '@/lib/otp'
import { sendMail } from '@/lib/email'
import { verificationEmail } from '@/lib/email-templates'

export async function POST(req: Request) {
  await ensureSchema()
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const email = normalizeEmail(clampStr(body.email, 160))
  const password = typeof body.password === 'string' ? body.password : ''
  const remember = body.remember !== false
  if (!isEmail(email) || !password) {
    return NextResponse.json({ error: 'Please enter your email and password.' }, { status: 400 })
  }

  const rows = (await sql`
    SELECT id, name, password_hash, email_verified FROM users WHERE email = ${email} LIMIT 1
  `) as { id: string; name: string; password_hash: string; email_verified: boolean }[]

  const user = rows[0]
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  if (!user.email_verified) {
    // Re-send a verification code and prompt the client to verify.
    const issued = await issueCode(email, 'verify')
    if (issued.ok) {
      const tpl = verificationEmail(user.name, issued.code!)
      await sendMail(email, tpl.subject, tpl.html)
    }
    return NextResponse.json({ error: 'unverified', email }, { status: 403 })
  }

  await createSession(user.id, remember)
  return NextResponse.json({ ok: true })
}
