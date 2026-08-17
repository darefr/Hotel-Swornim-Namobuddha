import { neon } from '@neondatabase/serverless'

// Single Neon SQL client. Uses tagged-template parameterization to prevent SQL injection.
// DATABASE_URL is server-only and never exposed to the client.
if (!process.env.DATABASE_URL) {
  // Do not throw at import time in preview; surface clearly when used.
  console.warn('[v0] DATABASE_URL is not set — database calls will fail until configured.')
}

export const sql = neon(process.env.DATABASE_URL || '')

export type Row = Record<string, unknown>
