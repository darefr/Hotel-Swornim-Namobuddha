import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { getOffers } from '@/lib/queries'
import { Tag, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Offers & Packages',
  description: 'Seasonal offers, honeymoon and family packages, and long-stay savings at Hotel Tukuche Peak.',
}

export default async function OffersPage() {
  const offers = await getOffers()

  return (
    <>
      <PageHeader
        eyebrow="Offers & Packages"
        title="Curated stays, thoughtfully priced"
        description="From honeymoons above the clouds to trekker’s basecamps — find the perfect way to experience Tukuche."
        image="/images/gallery/terrace.png"
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {offers.map((o, i) => (
            <Reveal key={o.id as string} delay={i * 0.08} className="glass glass-reflect flex flex-col rounded-3xl p-7">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground">
                  {o.category as string}
                </span>
                <span className="font-serif text-2xl font-semibold text-accent">{o.discount_pct as number}% off</span>
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold">{o.title as string}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{o.description as string}</p>
              {(o.code as string) && (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-accent/40 bg-accent/5 px-4 py-2.5 text-sm">
                  <Tag className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">Use code</span>
                  <span className="font-mono font-semibold tracking-wide text-accent">{o.code as string}</span>
                </div>
              )}
              <Link
                href={`/booking?offer=${o.code || ''}`}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Book with this offer <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
