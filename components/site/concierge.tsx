'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X, Send, Mountain } from 'lucide-react'
import { SUGGESTED_PROMPTS } from '@/lib/ai-context'
import { cn } from '@/lib/utils'

type Msg = { role: 'user' | 'assistant'; content: string }

const WELCOME: Msg = {
  role: 'assistant',
  content:
    "Namaste, and welcome to Hotel Tukuche Peak. I'm your personal concierge — ask me about our rooms, dining, experiences, or planning the perfect Himalayan stay.",
}

export function Concierge() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m) => m !== WELCOME) }),
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null)
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content: data?.message || 'I could not respond just now. Please try again, or reach us on WhatsApp.',
          },
        ])
        setLoading(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      setMessages((m) => [...m, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages((m) => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: acc }
          return copy
        })
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Something interrupted our connection. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Open AI concierge"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2.5 rounded-full glass-strong glass-reflect px-5 text-sm font-semibold text-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      >
        <Sparkles className="h-5 w-5 text-accent" />
        <span className="hidden sm:inline">Concierge</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm sm:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-50 flex flex-col glass-strong glass-reflect overflow-hidden inset-x-0 bottom-0 h-[85dvh] rounded-t-3xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-3xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Mountain className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div className="leading-tight">
                    <p className="font-serif text-[15px] font-semibold">Peak Concierge</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close concierge"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
                {messages.map((m, i) => (
                  <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed',
                        m.role === 'user'
                          ? 'rounded-br-md bg-primary text-primary-foreground'
                          : 'rounded-bl-md glass text-foreground',
                      )}
                    >
                      {m.content || (loading && i === messages.length - 1 ? '…' : '')}
                    </div>
                  </div>
                ))}
                {loading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-2xl rounded-bl-md glass px-4 py-3">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {messages.length <= 1 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => send(p)}
                        className="rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:text-accent"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-border/50 p-3">
                <div className="flex items-end gap-2 rounded-2xl glass px-3 py-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    placeholder="Ask the concierge…"
                    className="max-h-28 flex-1 resize-none bg-transparent py-1.5 text-[14px] outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-opacity disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
