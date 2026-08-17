// Central hotel information. Safe for client + server (no secrets).
export const HOTEL = {
  name: 'Hotel Tukuche Peak',
  tagline: 'A Himalayan luxury retreat above the clouds',
  location: 'Tukuche, Mustang, Nepal',
  address: 'Tukuche Village, Annapurna Circuit, Mustang District, Nepal',
  altitude: '2,590 m',
  email: 'hotelsonam@gmail.com',
  phoneDisplay: '+977 985-1019065',
  // WhatsApp number is exposed intentionally for click-to-chat links.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+977985-1019065',
  checkIn: '2:00 PM',
  checkOut: '11:00 AM',
  currency: 'USD',
  currencySymbol: '$',
  taxRate: 0.13, // 13% VAT applied to bookings
  serviceRate: 0.1, // 10% service charge
  coords: { lat: 28.7086, lng: 83.6489 },
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
} as const

export function whatsappLink(message?: string) {
  const digits = HOTEL.whatsapp.replace(/[^\d]/g, '')
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function formatCurrency(amount: number) {
  return `${HOTEL.currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}
