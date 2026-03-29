import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-md border border-gold/25 bg-warm-white px-4 py-3 text-[15px] text-charcoal font-sans',
          'ring-offset-background placeholder:text-warm-gray',
          'focus-visible:outline-none focus-visible:border-gold focus-visible:ring-[3px] focus-visible:ring-gold/10',
          'transition-colors duration-200',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
