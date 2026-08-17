import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/page-header'
import { HOTEL } from '@/lib/hotel'

export const metadata: Metadata = { title: 'Terms & Conditions' }

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" image="/images/gallery/terrace.png" />
      <section className="mx-auto max-w-3xl px-5 py-16 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-muted-foreground">
        <p>Welcome to {HOTEL.name}. By using our website and making a reservation, you agree to the following terms.</p>
        <h2>Reservations</h2>
        <p>
          All bookings are subject to availability and confirmation. Rates are quoted in {HOTEL.currency} and exclude
          applicable taxes and service charges unless stated otherwise.
        </p>
        <h2>Cancellation policy</h2>
        <p>
          Reservations may be cancelled free of charge up to 7 days before arrival. Cancellations within 7 days of
          arrival are subject to a charge equivalent to the first night.
        </p>
        <h2>Check-in & check-out</h2>
        <p>
          Check-in is from {HOTEL.checkIn} and check-out is by {HOTEL.checkOut}. Early check-in and late check-out are
          subject to availability.
        </p>
        <h2>Contact</h2>
        <p>For any questions about these terms, contact us at {HOTEL.email}.</p>
      </section>
    </>
  )
}
