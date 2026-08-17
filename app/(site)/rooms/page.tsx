import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/page-header'
import { RoomCard } from '@/components/site/room-card'
import { getRooms } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Rooms & Suites',
  description:
    'Discover our signature rooms and suites at Hotel Tukuche Peak — floor-to-ceiling Himalayan views, heated floors, and quiet alpine luxury.',
}

export default async function RoomsPage() {
  const rooms = await getRooms()

  return (
    <>
      <PageHeader
        eyebrow="Rooms & Suites"
        title="Sleep among the eight-thousanders"
        description="Four signature room types, each framing the Himalaya through walls of glass — designed for deep rest and quiet wonder."
        image="/images/rooms/glacier-suite-1.png"
      />
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} />
          ))}
        </div>
      </section>
    </>
  )
}
