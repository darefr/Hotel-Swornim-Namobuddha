'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type ThemeCtx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {}, setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('htp-theme')) as Theme | null
    const initial: Theme = stored ?? 'dark'
    setThemeState(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    document.documentElement.classList.toggle('dark', t === 'dark')
    try {
      localStorage.setItem('htp-theme', t)
    } catch {}
  }, [])

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem('htp-theme', next)
      } catch {}
      return next
    })
  }, [])

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
