import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={cn(i <= Math.round(value) ? 'fill-accent text-accent' : 'fill-transparent text-muted-foreground/40')}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}
