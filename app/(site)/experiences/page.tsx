import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { getExperiences } from '@/lib/queries'
import { formatCurrency, HOTEL, whatsappLink } from '@/lib/hotel'
import { Clock, Mountain, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Experiences & Attractions',
  description:
    'Guided Himalayan experiences from Hotel Tukuche Peak — sunrise over Dhaulagiri, apple-brandy distilleries, heritage walks and gorge treks.',
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences()

  return (
    <>
      <PageHeader
        eyebrow="Experiences & Attractions"
        title="Adventures at the roof of the world"
        description="Curated by our team and led by local guides — discover the living culture and raw beauty of Mustang."
        image="/images/gallery/valley.png"
      />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="space-y-6">
          {experiences.map((e, i) => (
            <Reveal
              key={e.id as string}
              delay={i * 0.06}
              className="glass glass-reflect flex flex-col gap-5 rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Mountain className="h-5 w-5 text-accent" />
                  <h3 className="font-serif text-xl font-semibold">{e.title as string}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description as string}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent" /> {e.duration as string}
                  </span>
                  <span>{e.difficulty as string}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className="font-serif text-lg font-semibold text-accent">
                  {Number(e.price) > 0 ? formatCurrency(Number(e.price)) : 'Complimentary'}
                </span>
                <a
                  href={whatsappLink(`Hello ${HOTEL.name}, I'd like to arrange the "${e.title}" experience.`)}
                  className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-semibold transition-colors hover:text-accent"
                >
                  <MessageCircle className="h-4 w-4" /> Arrange
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
