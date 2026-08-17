import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { ensureSchema } from '@/lib/schema'
import { isEmail, isNonEmpty, clampStr } from '@/lib/validation'
import { sendMail, ownerAddress } from '@/lib/email'
import { contactNotificationEmail } from '@/lib/email-templates'

export async function POST(req: Request) {
  await ensureSchema()
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const name = clampStr(body.name, 120)
  const email = clampStr(body.email, 160)
  const phone = clampStr(body.phone, 40)
  const subject = clampStr(body.subject, 160)
  const message = clampStr(body.message, 4000)

  if (!isNonEmpty(name) || !isEmail(email) || !isNonEmpty(message)) {
    return NextResponse.json({ error: 'Please provide your name, a valid email, and a message.' }, { status: 400 })
  }

  await sql`
    INSERT INTO contact_messages (name, email, phone, subject, message)
    VALUES (${name}, ${email}, ${phone || null}, ${subject || null}, ${message})
  `
  await sql`
    INSERT INTO notifications (audience, type, title, body)
    VALUES ('admin', 'contact', 'New enquiry received', ${`${name} (${email})`})
  `

  // Notify the hotel (best-effort — do not fail the request if email is down).
  const tpl = contactNotificationEmail({ name, email, phone, subject, message })
  await sendMail(ownerAddress(), tpl.subject, tpl.html)

  return NextResponse.json({ ok: true })
}
