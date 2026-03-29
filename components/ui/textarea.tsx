import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-gold/25 bg-warm-white px-4 py-3 text-[15px] text-charcoal font-sans',
          'ring-offset-background placeholder:text-warm-gray',
          'focus-visible:outline-none focus-visible:border-gold focus-visible:ring-[3px] focus-visible:ring-gold/10',
          'transition-colors duration-200',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
