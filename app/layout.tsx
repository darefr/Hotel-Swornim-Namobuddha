import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Fraunces } from 'next/font/google'
import { HOTEL } from '@/lib/hotel'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
})

const siteUrl = 'https://hoteltukuchepeak.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${HOTEL.name} — Luxury Himalayan Boutique Hotel in Tukuche, Nepal`,
    template: `%s · ${HOTEL.name}`,
  },
  description:
    'A boutique Himalayan luxury retreat in Tukuche on the Annapurna circuit. Cinematic mountain views, refined rooms, alpine dining, and effortless booking with a personal AI concierge.',
  keywords: [
    'Hotel Tukuche Peak',
    'Tukuche hotel',
    'luxury hotel Nepal',
    'Annapurna circuit hotel',
    'Mustang boutique hotel',
    'Himalayan luxury stay',
  ],
  authors: [{ name: HOTEL.name }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: HOTEL.name,
    title: `${HOTEL.name} — Luxury Himalayan Boutique Hotel`,
    description:
      'A boutique Himalayan luxury retreat in Tukuche, Nepal. Cinematic mountain views, refined rooms and alpine dining.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: HOTEL.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${HOTEL.name} — Luxury Himalayan Boutique Hotel`,
    description: 'A boutique Himalayan luxury retreat in Tukuche, Nepal.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: siteUrl },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f4f8' },
    { media: '(prefers-color-scheme: dark)', color: '#12161f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
