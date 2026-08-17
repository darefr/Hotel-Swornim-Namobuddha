import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/page-header'
import { StarRating } from '@/components/site/star-rating'
import { Reveal } from '@/components/site/reveal'
import { ReviewForm } from '@/components/site/review-form'
import { getApprovedReviews, getReviewStats } from '@/lib/queries'
import { Quote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Guest Reviews',
  description: 'Read what guests say about their stay at Hotel Tukuche Peak, and share your own experience.',
}

export default async function ReviewsPage() {
  const [reviews, stats] = await Promise.all([getApprovedReviews(30), getReviewStats()])

  return (
    <>
      <PageHeader
        eyebrow="Guest Reviews"
        title="Stories from the mountains"
        image="/images/gallery/spa.png"
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="mb-12 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3">
            <span className="font-serif text-5xl font-semibold text-accent">{(stats.avg || 5).toFixed(1)}</span>
            <div className="text-left">
              <StarRating value={stats.avg || 5} size={20} />
              <p className="mt-1 text-sm text-muted-foreground">from {stats.count} guest reviews</p>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={(i % 2) * 0.08} className="glass glass-reflect flex flex-col rounded-3xl p-6">
                <Quote className="h-6 w-6 text-accent/60" />
                <StarRating value={r.rating} className="mt-3" />
                <h3 className="mt-3 font-serif text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                <p className="mt-4 text-sm font-medium">— {r.guest_name}</p>
                {r.reply && (
                  <div className="mt-4 rounded-xl bg-secondary/60 p-3 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">Response from the hotel</p>
                    <p className="mt-1 text-muted-foreground">{r.reply}</p>
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  )
}
