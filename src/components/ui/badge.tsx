import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const Badge = ({ className, ...props }: ComponentProps<'span'>) => (
  <span
    className={cn(
      'bg-secondary text-secondary-foreground inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
      className,
    )}
    {...props}
  />
)
