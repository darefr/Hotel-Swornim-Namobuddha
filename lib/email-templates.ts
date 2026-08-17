import { HOTEL, formatCurrency } from './hotel'

// Premium, responsive, brand-consistent HTML email shell. No secrets ever included.
function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0f1420;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#e8eaf0;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${title}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1420;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#161c2b;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="padding:36px 40px 24px;background:linear-gradient(160deg,#1c2337,#12172440);border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#c8a45c;font-weight:600;">Himalayan Luxury Retreat</div>
          <div style="font-size:24px;font-weight:700;color:#ffffff;margin-top:6px;">${HOTEL.name}</div>
          <div style="font-size:13px;color:#9aa3b8;margin-top:2px;">${HOTEL.location}</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 40px;">${body}</td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:13px;color:#9aa3b8;line-height:1.6;">
            ${HOTEL.name}<br/>${HOTEL.address}<br/>
            ${HOTEL.phoneDisplay} &nbsp;·&nbsp; ${HOTEL.email}
          </div>
          <div style="font-size:11px;color:#5f6b85;margin-top:16px;">
            This message was sent by ${HOTEL.name}. For your security, we never ask for your password.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function codeBlock(code: string) {
  return `<div style="margin:24px 0;text-align:center;">
    <div style="display:inline-block;background:#0f1420;border:1px solid rgba(200,164,92,0.4);border-radius:14px;padding:18px 28px;">
      <span style="font-size:34px;letter-spacing:10px;font-weight:700;color:#c8a45c;font-family:'Courier New',monospace;">${code}</span>
    </div>
  </div>`
}

const heading = (t: string) => `<h1 style="font-size:22px;color:#ffffff;margin:0 0 12px;font-weight:700;">${t}</h1>`
const para = (t: string) => `<p style="font-size:15px;color:#c3c9d8;line-height:1.65;margin:0 0 14px;">${t}</p>`
const notice = (t: string) =>
  `<p style="font-size:13px;color:#9aa3b8;line-height:1.6;margin:16px 0 0;">${t}</p>`

export function verificationEmail(name: string, code: string) {
  return {
    subject: `Verify your ${HOTEL.name} account`,
    html: shell(
      'Verify your account',
      heading(`Welcome, ${name}`) +
        para('Thank you for creating an account with us. Enter the verification code below to confirm your email and unlock your guest portal.') +
        codeBlock(code) +
        para('This code expires in 10 minutes.') +
        notice('If you did not create this account, you can safely ignore this email.')
    ),
  }
}

export function passwordResetEmail(name: string, code: string) {
  return {
    subject: `Reset your ${HOTEL.name} password`,
    html: shell(
      'Reset your password',
      heading(`Hello ${name}`) +
        para('We received a request to reset your password. Use the code below to set a new one.') +
        codeBlock(code) +
        para('This code expires in 10 minutes.') +
        notice('If you did not request a password reset, please ignore this email — your password will remain unchanged.')
    ),
  }
}

type BookingEmailData = {
  reference: string
  guest_name: string
  guest_email: string
  guest_phone?: string | null
  room_name: string
  check_in: string
  check_out: string
  nights: number
  guests: number
  total: number
  payment_status: string
  status: string
  special_requests?: string | null
}

function bookingCard(b: BookingEmailData) {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:9px 0;font-size:13px;color:#9aa3b8;">${label}</td>
      <td style="padding:9px 0;font-size:14px;color:#ffffff;text-align:right;font-weight:600;">${value}</td>
    </tr>`
  return `<div style="background:#0f1420;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:22px 24px;margin:20px 0;">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c8a45c;font-weight:600;">Booking Reference</div>
    <div style="font-size:22px;font-weight:700;color:#ffffff;margin:4px 0 16px;font-family:'Courier New',monospace;">${b.reference}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Guest', b.guest_name)}
      ${row('Email', b.guest_email)}
      ${b.guest_phone ? row('Phone', b.guest_phone) : ''}
      ${row('Room', b.room_name)}
      ${row('Check-in', `${b.check_in} · from ${HOTEL.checkIn}`)}
      ${row('Check-out', `${b.check_out} · by ${HOTEL.checkOut}`)}
      ${row('Nights', String(b.nights))}
      ${row('Guests', String(b.guests))}
      ${row('Total', formatCurrency(b.total))}
      ${row('Payment', b.payment_status)}
      ${row('Status', b.status)}
      ${b.special_requests ? row('Requests', b.special_requests) : ''}
    </table>
  </div>`
}

export function bookingConfirmationEmail(b: BookingEmailData) {
  return {
    subject: `Booking Confirmed — ${b.reference}`,
    html: shell(
      'Booking confirmed',
      heading(`Your stay is confirmed, ${b.guest_name.split(' ')[0]}`) +
        para(`We can\u2019t wait to welcome you to ${HOTEL.name}. Here are the details of your reservation.`) +
        bookingCard(b) +
        para('If you need anything before your arrival — transfers, dietary needs, or a sunrise walk — simply reply to this email or message us on WhatsApp.') +
        notice(`We look forward to hosting you in ${HOTEL.location}.`)
    ),
  }
}

export function ownerBookingNotificationEmail(b: BookingEmailData) {
  return {
    subject: `New Booking — ${b.reference}`,
    html: shell(
      'New booking received',
      heading('New reservation received') +
        para(`A new booking has been made via the ${b.status === 'confirmed' ? 'website' : 'system'}. Full details below.`) +
        bookingCard(b)
    ),
  }
}

export function contactNotificationEmail(d: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  return {
    subject: `New enquiry — ${d.subject || 'Website contact'}`,
    html: shell(
      'New enquiry',
      heading('New website enquiry') +
        para(`<strong style="color:#fff;">${d.name}</strong> (${d.email}${d.phone ? `, ${d.phone}` : ''}) wrote:`) +
        `<div style="background:#0f1420;border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;font-size:14px;color:#c3c9d8;line-height:1.6;">${d.message}</div>`
    ),
  }
}
