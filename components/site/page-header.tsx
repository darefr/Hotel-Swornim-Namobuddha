import Image from 'next/image'

export function PageHeader({
  eyebrow,
  title,
  description,
  image = '/images/gallery/valley.png',
}: {
  eyebrow?: string
  title: string
  description?: string
  image?: string
}) {
  return (
    <section className="relative flex min-h-[44vh] items-end overflow-hidden pt-24 sm:min-h-[52vh]">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-10 sm:pb-14">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>}
        <h1 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/80">{description}</p>
        )}
      </div>
    </section>
  )
}
