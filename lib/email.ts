import 'server-only'
import nodemailer from 'nodemailer'
import { HOTEL } from './hotel'

// Gmail SMTP transport. Credentials come from server-only env vars and are never logged.
let transporter: nodemailer.Transporter | null = null

function getTransport() {
  if (transporter) return transporter
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    throw new Error('SMTP is not configured')
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user, pass },
  })
  return transporter
}

export async function sendMail(to: string, subject: string, html: string) {
  const from = `${HOTEL.name} <${process.env.SMTP_USER}>`
  try {
    const t = getTransport()
    await t.sendMail({ from, to, subject, html })
    return { ok: true as const }
  } catch (err) {
    // Never log credentials; log only a safe message.
    console.error('[v0] Email send failed:', (err as Error).message)
    return { ok: false as const, error: 'Email could not be sent' }
  }
}

export function ownerAddress() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER || HOTEL.email
}
