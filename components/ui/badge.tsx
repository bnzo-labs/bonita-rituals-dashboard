import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// DESIGN.md: rounded-[2px], 11px DM Sans uppercase, letter-spacing 0.06em, with border
const badgeVariants = cva(
  'inline-flex items-center rounded-md px-[10px] py-[3px] text-[11px] font-medium font-sans tracking-[0.06em] uppercase transition-colors',
  {
    variants: {
      variant: {
        default:   'bg-gold/10 text-gold-dark border border-gold/25',
        secondary: 'bg-peach text-charcoal border border-peach-deep',
        outline:   'text-charcoal border border-border',
        success:   'bg-success/10 text-success border border-success/20',
        warning:   'bg-warning/10 text-warning border border-warning/20',
        error:     'bg-danger/10 text-danger border border-danger/15',
        gold:      'bg-gold/10 text-gold-dark border border-gold/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
