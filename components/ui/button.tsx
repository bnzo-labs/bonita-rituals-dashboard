import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-sans text-[13px] font-medium tracking-[0.06em] uppercase',
    'rounded-sm ring-offset-background',
    'transition-all duration-200 hover:-translate-y-px',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-gold text-charcoal hover:bg-gold-dark',
        destructive: 'bg-danger text-warm-white hover:bg-danger/90',
        outline: 'border border-gold bg-transparent text-gold hover:bg-gold hover:text-charcoal',
        secondary: 'bg-peach text-charcoal hover:bg-peach-deep',
        ghost: 'hover:bg-gold/5 hover:text-gold-dark normal-case tracking-normal',
        link: 'text-gold underline-offset-4 hover:underline normal-case tracking-normal',
      },
      size: {
        default: 'h-11 px-8 py-3',
        sm: 'h-9 px-4 py-2 text-[12px]',
        lg: 'h-12 px-10 py-3 text-[13px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
