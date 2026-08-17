import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { getGallery } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A visual journey through Hotel Tukuche Peak — architecture, interiors, dining and the Himalayan landscape.',
}

export default async function GalleryPage() {
  const images = await getGallery()

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments above the clouds"
        image="/images/gallery/exterior-dusk.png"
      />
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {images.map((img, i) => (
            <Reveal key={img.id as string} delay={(i % 3) * 0.08} className="break-inside-avoid overflow-hidden rounded-3xl">
              <div className="group relative">
                <Image
                  src={(img.url as string) || '/images/hero.png'}
                  alt={(img.caption as string) || 'Hotel Tukuche Peak'}
                  width={800}
                  height={i % 2 === 0 ? 1000 : 700}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {(img.caption as string) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-sm font-medium text-white">{img.caption as string}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
