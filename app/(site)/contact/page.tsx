import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/page-header'
import { ContactForm } from '@/components/site/contact-form'
import { getFaqs } from '@/lib/queries'
import { HOTEL, whatsappLink } from '@/lib/hotel'
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with Hotel Tukuche Peak in ${HOTEL.location}. Call, email, or message us on WhatsApp.`,
}

export default async function ContactPage() {
  const faqs = await getFaqs()

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We’re here to help you plan"
        description="Reach our team any time — for reservations, transfers, dining, or simply to dream up your Himalayan escape."
        image="/images/gallery/lounge.png"
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {[
              { icon: MapPin, label: 'Address', value: HOTEL.address },
              { icon: Phone, label: 'Phone', value: HOTEL.phoneDisplay, href: `tel:${HOTEL.phoneDisplay.replace(/\s/g, '')}` },
              { icon: Mail, label: 'Email', value: HOTEL.email, href: `mailto:${HOTEL.email}` },
              { icon: Clock, label: 'Reception', value: '24 hours · Check-in ' + HOTEL.checkIn },
            ].map((c) => (
              <div key={c.label} className="glass glass-reflect flex items-start gap-4 rounded-2xl p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="mt-1 block text-sm font-medium transition-colors hover:text-accent">
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
            <a
              href={whatsappLink(`Hello ${HOTEL.name}, I have a question.`)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-5 w-5" /> Chat with us on WhatsApp
            </a>
          </div>

          <ContactForm />
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-center font-serif text-3xl font-semibold">Frequently asked questions</h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((f) => (
              <details key={f.id} className="group glass glass-reflect rounded-2xl p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.question}
                  <span className="text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
