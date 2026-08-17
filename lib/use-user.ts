'use client'

import useSWR from 'swr'
import type { SessionUser } from './auth'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<{ user: SessionUser | null }>('/api/me', fetcher, {
    revalidateOnFocus: false,
  })
  return { user: data?.user ?? null, isLoading, error, mutate }
}
