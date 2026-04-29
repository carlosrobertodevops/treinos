import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const Card = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn(
      'bg-card text-card-foreground rounded-xl border shadow-sm',
      className,
    )}
    {...props}
  />
)

export const CardHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('grid gap-1.5 p-6', className)} {...props} />
)

export const CardTitle = ({ className, ...props }: ComponentProps<'h3'>) => (
  <h3
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
)

export const CardDescription = ({
  className,
  ...props
}: ComponentProps<'p'>) => (
  <p className={cn('text-muted-foreground text-sm', className)} {...props} />
)

export const CardContent = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
)

export const CardFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
)
