// Lightweight validation + sanitization helpers (no external deps).
export function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

export function isNonEmpty(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

export function clampStr(v: unknown, max = 2000): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export function isDate(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v))
}

export function passwordStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4) // 0..4
}

export function isStrongEnough(pw: string) {
  return typeof pw === 'string' && pw.length >= 8
}

export function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}
