import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Bonita Rituals brand palette (DESIGN.md)
        gold: {
          DEFAULT: '#D4A017',
          dark: '#B8860B',
          light: '#F0C94A',
          50: '#FDF8E7',
          100: '#FAF0C4',
          200: '#F5E090',
          300: '#EFD05B',
          400: '#E8C030',
          500: '#D4A017',
          600: '#B8860B',
          700: '#8C6508',
          800: '#5F4405',
          900: '#332402',
        },
        peach: {
          DEFAULT: '#FAEBD7',      // --peach-bg
          deep: '#F5D5B8',         // --peach-deep
          50: '#FFF8F2',
          100: '#FFF0E6',
          200: '#FAEBD7',
          300: '#F5D5B8',
          400: '#EEBF88',
          500: '#E5A860',
        },
        cream: '#FDF8F3',           // --cream (dashboard bg)
        'warm-white': '#FFFDF9',    // --warm-white (cards, inputs)
        'warm-gray': '#8C7B6B',     // --warm-gray (muted text)
        charcoal: '#2C2420',        // --charcoal (foreground)
        // Status colors
        success: '#4A7C59',
        warning: '#C4820A',
        danger: '#A63228',
        // shadcn/ui CSS variable mapping
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',                    // 4px — cards
        md: 'calc(var(--radius) - 2px)',        // 2px — inputs, badges
        sm: 'calc(var(--radius) - 3px)',        // 1px — buttons
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],      // DM Sans
        display: ['var(--font-display)', 'Georgia', 'serif'],        // Cormorant Garamond
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
