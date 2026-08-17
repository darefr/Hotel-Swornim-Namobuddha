'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X, Mountain, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { useUser } from '@/lib/use-user'

const LINKS = [
  { href: '/rooms', label: 'Rooms' },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/offers', label: 'Offers' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const { user } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5',
          scrolled ? 'glass-strong glass-reflect' : 'glass glass-reflect',
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Hotel Tukuche Peak home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Mountain className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[15px] font-semibold tracking-tight">Tukuche Peak</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Himalayan Hotel</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground',
                pathname.startsWith(l.href) ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggle}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <Link
            href={user ? '/account' : '/login'}
            className="hidden h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
          >
            <UserRound className="h-4 w-4" />
            {user ? user.name.split(' ')[0] : 'Sign in'}
          </Link>

          <Link
            href="/booking"
            className="hidden h-9 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm transition-transform hover:scale-[1.03] sm:flex"
          >
            Book now
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl glass-strong glass-reflect p-3 lg:hidden"
          >
            <div className="flex flex-col">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-foreground/90 transition-colors hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              <Link
                href={user ? '/account' : '/login'}
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-foreground/90 transition-colors hover:bg-secondary"
              >
                {user ? 'My account' : 'Sign in'}
              </Link>
              <Link
                href="/booking"
                className="mt-1 flex items-center justify-center rounded-xl bg-accent px-4 py-3 text-[15px] font-semibold text-accent-foreground"
              >
                Book your stay
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
