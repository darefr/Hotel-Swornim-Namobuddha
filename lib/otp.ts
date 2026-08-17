import 'server-only'
import { sql } from './db'
import { genCode } from './validation'

const CODE_TTL_MIN = 10
const RESEND_WINDOW_SEC = 60
const MAX_ATTEMPTS = 5

// Create and store a fresh code, enforcing a resend cooldown per email+purpose.
export async function issueCode(email: string, purpose: 'verify' | 'reset'): Promise<{ ok: boolean; code?: string; error?: string }> {
  const recent = (await sql`
    SELECT created_at FROM verification_codes
    WHERE email = ${email} AND purpose = ${purpose}
    ORDER BY created_at DESC LIMIT 1
  `) as { created_at: string }[]

  if (recent[0]) {
    const elapsed = (Date.now() - new Date(recent[0].created_at).getTime()) / 1000
    if (elapsed < RESEND_WINDOW_SEC) {
      return { ok: false, error: `Please wait ${Math.ceil(RESEND_WINDOW_SEC - elapsed)}s before requesting another code.` }
    }
  }

  // Invalidate previous unconsumed codes.
  await sql`UPDATE verification_codes SET consumed = true WHERE email = ${email} AND purpose = ${purpose} AND consumed = false`

  const code = genCode()
  const expires = new Date(Date.now() + CODE_TTL_MIN * 60 * 1000).toISOString()
  await sql`
    INSERT INTO verification_codes (email, code, purpose, expires_at)
    VALUES (${email}, ${code}, ${purpose}, ${expires})
  `
  return { ok: true, code }
}

// Verify a submitted code. Increments attempts, enforces expiry and max attempts.
export async function checkCode(email: string, purpose: 'verify' | 'reset', code: string): Promise<{ ok: boolean; error?: string }> {
  const rows = (await sql`
    SELECT id, code, expires_at, attempts, consumed FROM verification_codes
    WHERE email = ${email} AND purpose = ${purpose} AND consumed = false
    ORDER BY created_at DESC LIMIT 1
  `) as { id: string; code: string; expires_at: string; attempts: number; consumed: boolean }[]

  const row = rows[0]
  if (!row) return { ok: false, error: 'No active code. Please request a new one.' }
  if (row.attempts >= MAX_ATTEMPTS) {
    await sql`UPDATE verification_codes SET consumed = true WHERE id = ${row.id}`
    return { ok: false, error: 'Too many attempts. Please request a new code.' }
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, error: 'This code has expired. Please request a new one.' }
  }
  if (row.code !== code.trim()) {
    await sql`UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ${row.id}`
    return { ok: false, error: 'Incorrect code. Please try again.' }
  }

  await sql`UPDATE verification_codes SET consumed = true WHERE id = ${row.id}`
  return { ok: true }
}
