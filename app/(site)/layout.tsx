import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { Concierge } from '@/components/site/concierge'
import { HOTEL } from '@/lib/hotel'

const hotelJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: HOTEL.name,
  description: 'A boutique Himalayan luxury retreat in Tukuche, Nepal on the Annapurna circuit.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: HOTEL.address,
    addressLocality: 'Tukuche',
    addressRegion: 'Mustang',
    addressCountry: 'NP',
  },
  telephone: HOTEL.phoneDisplay,
  email: HOTEL.email,
  geo: { '@type': 'GeoCoordinates', latitude: HOTEL.coords.lat, longitude: HOTEL.coords.lng },
  starRating: { '@type': 'Rating', ratingValue: '5' },
  url: 'https://hoteltukuchepeak.com',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Concierge />
    </div>
  )
}
