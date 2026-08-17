'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { Star, CheckCircle2, Clock } from 'lucide-react'
import { useUser } from '@/lib/use-user'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ReviewForm() {
  const { user, isLoading } = useUser()
  const { data, mutate } = useSWR<{ review: Record<string, unknown> | null }>(user ? '/api/reviews' : null, fetcher)
  const existing = data?.review

  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (existing) {
      setRating(Number(existing.rating) || 5)
      setTitle((existing.title as string) || '')
      setBody((existing.body as string) || '')
    }
  }, [existing])

  if (isLoading) return null

  if (!user) {
    return (
      <div className="glass-strong glass-reflect rounded-3xl p-8 text-center">
        <h3 className="font-serif text-2xl font-semibold">Share your experience</h3>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your guest account to write a review.</p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
        >
          Sign in
        </Link>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, title, body }),
    })
    const d = await res.json()
    if (!res.ok) {
      setMessage(d.error || 'Something went wrong.')
      setStatus('error')
      return
    }
    setMessage(d.message)
    setStatus('success')
    mutate()
  }

  const field = 'w-full rounded-xl bg-background/40 border border-border px-4 py-3 text-sm outline-none focus:border-accent'

  return (
    <form onSubmit={submit} className="glass-strong glass-reflect space-y-4 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl font-semibold">{existing ? 'Edit your review' : 'Write a review'}</h3>
        {existing && (
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
              existing.status === 'approved'
                ? 'bg-emerald-500/15 text-emerald-500'
                : 'bg-amber-500/15 text-amber-500',
            )}
          >
            {existing.status === 'approved' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
            {existing.status === 'approved' ? 'Published' : 'Pending approval'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
            className="p-1"
          >
            <Star
              className={cn(
                'h-7 w-7 transition-colors',
                i <= (hover || rating) ? 'fill-accent text-accent' : 'fill-transparent text-muted-foreground/40',
              )}
            />
          </button>
        ))}
      </div>

      <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Review title" className={field} />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        rows={4}
        placeholder="Tell other travellers about your stay…"
        className={`${field} resize-none`}
      />

      {message && (
        <p className={cn('text-sm', status === 'error' ? 'text-destructive' : 'text-emerald-500')}>{message}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {status === 'loading' ? 'Submitting…' : existing ? 'Update review' : 'Submit review'}
      </button>
    </form>
  )
}
