import { sql } from './db'

// Idempotent schema. DDL has no user input, so plain sql.query is safe here.
const DDL: string[] = [
  `CREATE EXTENSION IF NOT EXISTS pgcrypto`,

  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'guest',
    email_verified BOOLEAN NOT NULL DEFAULT false,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    tier TEXT NOT NULL DEFAULT 'Explorer',
    preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    purpose TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed BOOLEAN NOT NULL DEFAULT false,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_codes_email ON verification_codes(email, purpose)`,

  `CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL DEFAULT '',
    price NUMERIC(10,2) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    size_sqm INTEGER NOT NULL DEFAULT 30,
    beds TEXT NOT NULL DEFAULT '1 King',
    total_units INTEGER NOT NULL DEFAULT 3,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active',
    sort INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    room_name TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INTEGER NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    room_total NUMERIC(10,2) NOT NULL,
    tax NUMERIC(10,2) NOT NULL DEFAULT 0,
    service NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'unpaid',
    special_requests TEXT,
    source TEXT NOT NULL DEFAULT 'online',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room_id, check_in, check_out)`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id)`,

  `CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reply TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    discount_pct INTEGER NOT NULL DEFAULT 0,
    code TEXT,
    category TEXT NOT NULL DEFAULT 'seasonal',
    image TEXT,
    start_date DATE,
    end_date DATE,
    usage_limit INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(10,2) NOT NULL,
    image TEXT,
    dietary JSONB NOT NULL DEFAULT '[]'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT false,
    available BOOLEAN NOT NULL DEFAULT true,
    sort INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    duration TEXT,
    difficulty TEXT,
    price NUMERIC(10,2),
    sort INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    caption TEXT,
    category TEXT DEFAULT 'hotel',
    sort INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    sort INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    room_preference TEXT,
    check_in DATE,
    check_out DATE,
    guests INTEGER DEFAULT 1,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'waiting',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    label TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, item_type, item_id)
  )`,

  `CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audience TEXT NOT NULL DEFAULT 'admin',
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb
  )`,
]

// Bump when the schema shape changes. A version mismatch triggers a one-time
// rebuild of the app tables (used to clear incompatible legacy tables).
const SCHEMA_VERSION = 2

const APP_TABLES = [
  'loyalty_transactions',
  'wishlist',
  'notifications',
  'contact_messages',
  'waitlist',
  'reviews',
  'bookings',
  'menu_items',
  'menu_categories',
  'offers',
  'experiences',
  'gallery',
  'faqs',
  'verification_codes',
  'rooms',
  'users',
  'settings',
]

let initialized = false

async function currentVersion(): Promise<number> {
  await sql.query(`CREATE TABLE IF NOT EXISTS _schema_meta (version INTEGER NOT NULL)`)
  const rows = (await sql.query(`SELECT version FROM _schema_meta LIMIT 1`)) as { version: number }[]
  return rows[0]?.version ?? 0
}

export async function ensureSchema() {
  if (initialized) return

  const version = await currentVersion()
  if (version < SCHEMA_VERSION) {
    // One-time reset to clear legacy/incompatible tables from the previous site.
    for (const t of APP_TABLES) {
      await sql.query(`DROP TABLE IF EXISTS ${t} CASCADE`)
    }
  }

  for (const stmt of DDL) {
    await sql.query(stmt)
  }
  await seed()

  await sql.query(`DELETE FROM _schema_meta`)
  await sql.query(`INSERT INTO _schema_meta (version) VALUES (${SCHEMA_VERSION})`)
  initialized = true
}

async function seed() {
  const rooms = [
    {
      slug: 'glacier-suite',
      name: 'Glacier Panorama Suite',
      description: 'Our signature suite with floor-to-ceiling glass framing the Dhaulagiri massif.',
      long_description:
        'The Glacier Panorama Suite is the crown of Hotel Tukuche Peak. A private glass-walled lounge opens onto an uninterrupted view of the Dhaulagiri and Nilgiri peaks, with a heated stone floor, a king bed dressed in alpine linen, and a deep soaking tub positioned for sunrise over the Himalaya.',
      price: 420,
      capacity: 2,
      size_sqm: 62,
      beds: '1 King',
      total_units: 2,
      featured: true,
      sort: 1,
      amenities: ['Panoramic mountain view', 'Heated stone floor', 'Soaking tub', 'Nespresso bar', 'Rain shower', 'Smart climate', 'Free Wi-Fi', 'In-room dining'],
      images: ['/images/rooms/glacier-suite-1.png', '/images/rooms/glacier-suite-2.png'],
    },
    {
      slug: 'summit-deluxe',
      name: 'Summit Deluxe King',
      description: 'A refined king room with a private balcony over the Kali Gandaki valley.',
      long_description:
        'Warm timber, brushed brass and glass define the Summit Deluxe King. Step onto your private balcony above the deepest gorge on earth, then retreat to a king bed and a walk-in rain shower finished in local slate.',
      price: 280,
      capacity: 2,
      size_sqm: 42,
      beds: '1 King',
      total_units: 5,
      featured: true,
      sort: 2,
      amenities: ['Valley-view balcony', 'Rain shower', 'Nespresso bar', 'Smart climate', 'Free Wi-Fi', 'Minibar'],
      images: ['/images/rooms/summit-deluxe-1.png', '/images/rooms/summit-deluxe-2.png'],
    },
    {
      slug: 'alpine-twin',
      name: 'Alpine Twin Retreat',
      description: 'Ideal for friends and trekkers, with two plush beds and a cozy reading nook.',
      long_description:
        'Designed for companions on the Annapurna circuit, the Alpine Twin Retreat pairs two generous beds with a heated reading nook and a glass corner that catches the last alpenglow on the peaks.',
      price: 220,
      capacity: 2,
      size_sqm: 38,
      beds: '2 Queens',
      total_units: 6,
      featured: false,
      sort: 3,
      amenities: ['Twin queen beds', 'Reading nook', 'Heated floor', 'Free Wi-Fi', 'Drying rack for gear'],
      images: ['/images/rooms/alpine-twin-1.png', '/images/rooms/alpine-twin-2.png'],
    },
    {
      slug: 'heritage-family',
      name: 'Heritage Family Loft',
      description: 'A two-level loft blending Thakali craft with modern comfort for families.',
      long_description:
        'The Heritage Family Loft celebrates Thakali heritage across two levels — a king suite below and a children\u2019s loft above — with handwoven textiles, a fireplace lounge and a picture window onto the orchards of Tukuche.',
      price: 360,
      capacity: 4,
      size_sqm: 68,
      beds: '1 King + 2 Singles',
      total_units: 3,
      featured: true,
      sort: 4,
      amenities: ['Two levels', 'Fireplace lounge', 'Family bathroom', 'Free Wi-Fi', 'Board games', 'In-room dining'],
      images: ['/images/rooms/heritage-family-1.png', '/images/rooms/heritage-family-2.png'],
    },
  ]

  for (const r of rooms) {
    await sql`
      INSERT INTO rooms (slug, name, description, long_description, price, capacity, size_sqm, beds, total_units, amenities, images, featured, sort)
      VALUES (${r.slug}, ${r.name}, ${r.description}, ${r.long_description}, ${r.price}, ${r.capacity}, ${r.size_sqm}, ${r.beds}, ${r.total_units}, ${JSON.stringify(r.amenities)}, ${JSON.stringify(r.images)}, ${r.featured}, ${r.sort})
      ON CONFLICT (slug) DO NOTHING
    `
  }

  // Menu
  const categories = ['Sunrise Breakfast', 'Thakali Signatures', 'Alpine Mains', 'Sweet & Warm', 'Mountain Bar']
  for (let i = 0; i < categories.length; i++) {
    await sql`INSERT INTO menu_categories (name, sort) SELECT ${categories[i]}, ${i}
      WHERE NOT EXISTS (SELECT 1 FROM menu_categories WHERE name = ${categories[i]})`
  }
  const cats = (await sql`SELECT id, name FROM menu_categories`) as { id: string; name: string }[]
  const catId = (n: string) => cats.find((c) => c.name === n)?.id
  const items: [string, string, string, number, boolean, string[]][] = [
    ['Sunrise Breakfast', 'Himalayan Buckwheat Pancakes', 'Stacked buckwheat pancakes, apple-orchard compote, local honey.', 12, true, ['Vegetarian']],
    ['Sunrise Breakfast', 'Tukuche Farm Eggs', 'Free-range eggs, yak butter toast, roasted tomatoes.', 10, false, []],
    ['Thakali Signatures', 'Thakali Dal Bhat Set', 'The legendary Thakali platter — dal, rice, seasonal tarkari, gundruk, pickle.', 18, true, ['Vegetarian option']],
    ['Thakali Signatures', 'Buckwheat Dhido & Mountain Greens', 'Traditional dhido with fermented greens and timur-spiced broth.', 15, false, ['Vegan']],
    ['Alpine Mains', 'Slow-Braised Highland Lamb', 'Lamb shank braised in juniper and local herbs, root vegetable mash.', 26, true, []],
    ['Alpine Mains', 'Pan-Seared Rainbow Trout', 'Kali Gandaki trout, brown butter, wilted spinach, lemon.', 24, false, []],
    ['Sweet & Warm', 'Apple & Sea Buckthorn Tart', 'Tukuche orchard apples, sea buckthorn, vanilla cream.', 9, true, ['Vegetarian']],
    ['Sweet & Warm', 'Hot Spiced Chocolate', 'Dark chocolate, Himalayan spices, whipped yak cream.', 7, false, ['Vegetarian']],
    ['Mountain Bar', 'Tukuche Apple Brandy', 'The valley\u2019s famed marpha-style apple brandy, neat.', 11, false, []],
    ['Mountain Bar', 'Sea Buckthorn Highball', 'Sparkling sea buckthorn, citrus, mountain herbs (non-alcoholic).', 8, true, ['Non-alcoholic']],
  ]
  for (let i = 0; i < items.length; i++) {
    const [cat, name, desc, price, featured, dietary] = items[i]
    const cid = catId(cat)
    if (!cid) continue
    await sql`INSERT INTO menu_items (category_id, name, description, price, dietary, featured, sort)
      SELECT ${cid}, ${name}, ${desc}, ${price}, ${JSON.stringify(dietary)}, ${featured}, ${i}
      WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = ${name})`
  }

  // Offers
  const offers = [
    ['himalayan-honeymoon', 'Himalayan Honeymoon', 'Two nights in the Glacier Suite, private sunrise breakfast, and a couples spa ritual.', 20, 'HONEYMOON20', 'couple'],
    ['trekkers-basecamp', 'Trekker\u2019s Basecamp', 'Restorative stay for Annapurna trekkers — gear drying, hearty meals, late checkout.', 15, 'BASECAMP15', 'trekking'],
    ['long-stay-serenity', 'Long-Stay Serenity', 'Stay 5 nights, pay for 4. Slow travel in the heart of Mustang.', 20, 'STAY5PAY4', 'long-stay'],
    ['family-orchard', 'Family Orchard Escape', 'Family loft, kids stay free, and a guided orchard walk.', 12, 'FAMILY12', 'family'],
  ]
  for (const [slug, title, description, discount, code, category] of offers) {
    await sql`INSERT INTO offers (slug, title, description, discount_pct, code, category, active)
      SELECT ${slug}, ${title}, ${description}, ${discount}, ${code}, ${category}, true
      WHERE NOT EXISTS (SELECT 1 FROM offers WHERE slug = ${slug})`
  }

  // Experiences
  const experiences = [
    ['sunrise-dhaulagiri', 'Sunrise over Dhaulagiri', 'A guided pre-dawn walk to the viewpoint for first light on the 8,000m giants.', '2 hours', 'Easy', 0, 1],
    ['tukuche-distillery', 'Apple Brandy Distillery Tour', 'Taste the valley\u2019s famed marpha apple brandy at a family distillery.', '3 hours', 'Easy', 25, 2],
    ['thakali-village-walk', 'Thakali Heritage Village Walk', 'Explore stone courtyards, monasteries and the living culture of Tukuche.', 'Half day', 'Easy', 20, 3],
    ['kali-gandaki-gorge', 'Kali Gandaki Gorge Trek', 'A guided trek into the deepest gorge on earth, with a riverside picnic.', 'Full day', 'Moderate', 45, 4],
  ]
  for (const [slug, title, description, duration, difficulty, price, sort] of experiences) {
    await sql`INSERT INTO experiences (slug, title, description, duration, difficulty, price, sort)
      SELECT ${slug}, ${title}, ${description}, ${duration}, ${difficulty}, ${price}, ${sort}
      WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE slug = ${slug})`
  }

  // FAQs
  const faqs = [
    ['What are the check-in and check-out times?', 'Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be arranged on request, subject to availability.', 'stay'],
    ['How do I get to Hotel Tukuche Peak?', 'Tukuche is on the Annapurna circuit in Mustang. Most guests fly to Jomsom and drive ~1 hour, or drive from Pokhara via Beni. We can arrange private transfers.', 'location'],
    ['Do you have Wi-Fi and power?', 'Yes. All rooms include complimentary Wi-Fi and reliable power with backup, even in the high mountains.', 'amenities'],
    ['Is the restaurant open to non-guests?', 'Yes, our alpine restaurant welcomes both guests and visitors. Reservations are recommended in peak trekking season.', 'dining'],
    ['What is your cancellation policy?', 'Reservations can be cancelled free of charge up to 7 days before arrival. Within 7 days, the first night is charged.', 'booking'],
    ['Do you accommodate dietary needs?', 'Absolutely — we offer vegetarian, vegan and gluten-conscious options. Let us know your preferences when booking.', 'dining'],
  ]
  for (let i = 0; i < faqs.length; i++) {
    const [question, answer, category] = faqs[i]
    await sql`INSERT INTO faqs (question, answer, category, sort)
      SELECT ${question}, ${answer}, ${category}, ${i}
      WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question = ${question})`
  }

  // Gallery
  const gallery = [
    ['/images/gallery/exterior-dusk.png', 'The hotel at dusk beneath Dhaulagiri', 'hotel'],
    ['/images/gallery/lounge.png', 'The glass lounge and fireplace', 'interior'],
    ['/images/gallery/dining.png', 'Alpine dining room at golden hour', 'dining'],
    ['/images/gallery/terrace.png', 'Mountain-view terrace', 'hotel'],
    ['/images/gallery/valley.png', 'The Kali Gandaki valley', 'surroundings'],
    ['/images/gallery/spa.png', 'The stone spa and wellness room', 'interior'],
  ]
  for (let i = 0; i < gallery.length; i++) {
    const [url, caption, category] = gallery[i]
    await sql`INSERT INTO gallery (url, caption, category, sort)
      SELECT ${url}, ${caption}, ${category}, ${i}
      WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE url = ${url})`
  }

  // Seed approved sample reviews so the public site is not empty (marked approved).
  const reviews = [
    ['Ava Lindqvist', 5, 'A dream above the clouds', 'We woke to Dhaulagiri glowing pink from our bed. The service was impeccable and the Thakali dinner unforgettable.'],
    ['Rohan Mehta', 5, 'The best stay on the whole circuit', 'After days of trekking, the heated floors and the hot spiced chocolate felt like pure luxury. Staff treated us like family.'],
    ['Sophie Berger', 4, 'Stunning and serene', 'Beautiful glass architecture and calm design. The sunrise walk they arranged was the highlight of our Nepal trip.'],
  ]
  for (const [guest_name, rating, title, body] of reviews) {
    await sql`INSERT INTO reviews (guest_name, rating, title, body, status)
      SELECT ${guest_name}, ${rating}, ${title}, ${body}, 'approved'
      WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE title = ${title} AND guest_name = ${guest_name})`
  }
}
