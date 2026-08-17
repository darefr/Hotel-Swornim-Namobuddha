import { NextResponse } from 'next/server'
import { ensureSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

// Idempotent: creates tables and seeds baseline content if missing.
export async function GET() {
  try {
    await ensureSchema()
    return NextResponse.json({ ok: true, message: 'Schema ensured and seeded.' })
  } catch (err) {
    console.error('[v0] Setup failed:', (err as Error).message)
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}
