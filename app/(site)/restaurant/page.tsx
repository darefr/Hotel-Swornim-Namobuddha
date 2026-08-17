import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/page-header'
import { formatCurrency, HOTEL, whatsappLink } from '@/lib/hotel'
import { getMenu } from '@/lib/queries'
import { MessageCircle, Leaf } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Restaurant & Dining',
  description:
    'Thakali signatures and alpine cuisine at Hotel Tukuche Peak, served beneath the Himalaya with produce from the valley’s orchards.',
}

export default async function RestaurantPage() {
  const menu = await getMenu()

  return (
    <>
      <PageHeader
        eyebrow="Restaurant"
        title="A table beneath the peaks"
        description="Traditional Thakali cooking meets modern alpine cuisine — slow, seasonal, and rooted in the valley."
        image="/images/gallery/dining.png"
      />

      <section className="mx-auto max-w-4xl px-5 py-16 sm:py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Our philosophy</p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold sm:text-4xl">
            Mountain-grown, hand-crafted, unforgettable
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            Our kitchen celebrates the Thakali heritage of the Kali Gandaki valley — buckwheat, apples, highland herbs and
            timur pepper — alongside refined alpine dishes. Every plate is designed to be savoured slowly, with the
            Himalaya as your view.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          {menu.map((cat) => (
            <div key={cat.id}>
              <div className="mb-6 flex items-center gap-4">
                <h3 className="font-serif text-2xl font-semibold">{cat.name}</h3>
                <span className="h-px flex-1 bg-border" />
              </div>
              <ul className="space-y-5">
                {cat.items.map((item: Record<string, unknown>) => (
                  <li key={item.id as string} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium">{item.name as string}</h4>
                        {(item.featured as boolean) && (
                          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                            Signature
                          </span>
                        )}
                        {Array.isArray(item.dietary) &&
                          (item.dietary as string[]).map((d) => (
                            <span key={d} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Leaf className="h-3 w-3 text-emerald-500" /> {d}
                            </span>
                          ))}
                      </div>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                        {item.description as string}
                      </p>
                    </div>
                    <span className="shrink-0 font-serif text-lg font-semibold text-accent">
                      {formatCurrency(item.price as number)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-strong glass-reflect rounded-3xl p-8 text-center">
          <h3 className="font-serif text-2xl font-semibold">Reserve a table</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Our restaurant welcomes both guests and visitors. Reserve your table and let us prepare something
            unforgettable.
          </p>
          <a
            href={whatsappLink(`Hello ${HOTEL.name}, I'd like to reserve a table at your restaurant.`)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" /> Reserve on WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
