'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-strong glass-reflect flex flex-col items-center rounded-3xl p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 font-serif text-2xl font-semibold">Message sent</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for reaching out. Our team will respond to you shortly.
        </p>
      </div>
    )
  }

  const field =
    'w-full rounded-xl bg-background/40 border border-border px-4 py-3 text-sm outline-none transition-colors focus:border-accent'

  return (
    <form onSubmit={onSubmit} className="glass-strong glass-reflect space-y-4 rounded-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
          <input id="name" name="name" required className={field} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className={field} placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">Phone <span className="text-muted-foreground">(optional)</span></label>
          <input id="phone" name="phone" className={field} placeholder="+977 …" />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">Subject</label>
          <input id="subject" name="subject" className={field} placeholder="How can we help?" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
        <textarea id="message" name="message" required rows={5} className={`${field} resize-none`} placeholder="Tell us about your stay…" />
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
