import type { MetadataRoute } from 'next'
import { getRooms } from '@/lib/queries'

const base = 'https://hoteltukuchepeak.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/rooms', '/restaurant', '/offers', '/experiences', '/gallery', '/reviews', '/contact', '/booking', '/login', '/signup']
  const staticEntries = routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.7,
  }))

  let roomEntries: MetadataRoute.Sitemap = []
  try {
    const rooms = await getRooms()
    roomEntries = rooms.map((room) => ({
      url: `${base}/rooms/${room.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    roomEntries = []
  }

  return [...staticEntries, ...roomEntries]
}
