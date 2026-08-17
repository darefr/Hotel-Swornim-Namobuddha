import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/page-header'
import { HOTEL } from '@/lib/hotel'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" image="/images/gallery/valley.png" />
      <section className="mx-auto max-w-3xl px-5 py-16 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-muted-foreground">
        <p>
          At {HOTEL.name}, we are committed to protecting your privacy. This policy explains how we collect, use and
          safeguard your information when you use our website and services.
        </p>
        <h2>Information we collect</h2>
        <p>
          We collect information you provide when creating an account, making a booking, submitting a review, or
          contacting us — including your name, email, phone number and reservation details.
        </p>
        <h2>How we use your information</h2>
        <p>
          Your information is used to manage reservations, communicate with you about your stay, process transactional
          emails, and improve our services. We never sell your personal data.
        </p>
        <h2>Data security</h2>
        <p>
          Passwords are encrypted, sessions are protected, and sensitive credentials are stored securely on our servers.
          We apply industry best practices to keep your data safe.
        </p>
        <h2>Contact</h2>
        <p>
          For any privacy questions, contact us at {HOTEL.email} or {HOTEL.phoneDisplay}.
        </p>
      </section>
    </>
  )
}
