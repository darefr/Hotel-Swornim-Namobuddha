import 'server-only'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { sql } from './db'

const SESSION_COOKIE = 'htp_session'
const ADMIN_COOKIE = 'htp_admin'
const encoder = new TextEncoder()

function secret() {
  const s = process.env.AUTH_SECRET
  if (!s) throw new Error('AUTH_SECRET is not configured')
  return encoder.encode(s)
}

export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  email_verified: boolean
  loyalty_points: number
  tier: string
  phone?: string | null
  whatsapp?: string | null
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// ---- Guest session (JWT in httpOnly cookie) ----
export async function createSession(userId: string, remember = true) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(remember ? '30d' : '1d')
    .sign(secret())

  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none', // required so the session works inside the v0 preview iframe
    path: '/',
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
  })
}

export async function destroySession() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const jar = await cookies()
    const token = jar.get(SESSION_COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, secret())
    const uid = payload.uid as string
    if (!uid) return null
    const rows = (await sql`
      SELECT id, name, email, role, email_verified, loyalty_points, tier, phone, whatsapp
      FROM users WHERE id = ${uid} LIMIT 1
    `) as SessionUser[]
    return rows[0] || null
  } catch {
    return null
  }
}

export async function requireUser(): Promise<SessionUser | null> {
  const user = await getCurrentUser()
  return user
}

// ---- Admin session (separate cookie, credentials from env) ----
export async function createAdminSession() {
  const token = await new SignJWT({ admin: true, role: 'SUPER_ADMIN' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret())
  const jar = await cookies()
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export async function destroyAdminSession() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
}

export async function getAdmin(): Promise<{ role: string } | null> {
  try {
    const jar = await cookies()
    const token = jar.get(ADMIN_COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, secret())
    if (!payload.admin) return null
    return { role: (payload.role as string) || 'ADMIN' }
  } catch {
    return null
  }
}

export function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPass = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPass) return false
  return normalizeEmail(email) === normalizeEmail(adminEmail) && password === adminPass
}
