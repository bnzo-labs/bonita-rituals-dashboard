'use client'

import { cn } from '@/lib/utils'

const locales = ['es', 'en', 'fr'] as const
export type Locale = (typeof locales)[number]

interface LanguageSwitcherProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}

export function LanguageSwitcher({ locale, onLocaleChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2" role="navigation" aria-label="Language selector">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onLocaleChange(l)}
            className={cn(
              'px-2 py-0.5 text-[12px] font-sans font-medium tracking-[0.08em] uppercase transition-all duration-150',
              locale === l
                ? 'text-gold-dark border border-gold/60 bg-gold/8'
                : 'text-warm-gray border border-transparent hover:text-gold-dark'
            )}
            aria-current={locale === l ? 'true' : undefined}
          >
            {l.toUpperCase()}
          </button>
          {i < locales.length - 1 && (
            <span className="text-warm-gray/40 text-xs select-none leading-none">|</span>
          )}
        </span>
      ))}
    </div>
  )
}
