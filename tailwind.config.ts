import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF8F0',
          100: '#FFF0D9',
          200: '#FFD999',
          300: '#FFBB55',
          400: '#FFA922',
          DEFAULT: '#FF9933',
          600: '#E67300',
          700: '#CC5500',
          800: '#A34000',
          900: '#7A2D00',
        },
        gold: {
          DEFAULT: '#FFD700',
          dark: '#C9A800',
        },
        cream: {
          DEFAULT: '#FDF6EC',
          dark: '#F5E6D0',
          darker: '#EDD5B0',
        },
        temple: {
          brown: '#2C1810',
          mahogany: '#5C2E1A',
          sand: '#D4A574',
          muted: '#8B6552',
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Lato"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(110%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(110%)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.93)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      boxShadow: {
        temple: '0 4px 24px -4px rgba(255, 153, 51, 0.20)',
        'temple-lg': '0 8px 40px -8px rgba(255, 153, 51, 0.30)',
        'temple-glow': '0 0 0 3px rgba(255, 153, 51, 0.25)',
        'inner-saffron': 'inset 0 0 0 1px rgba(255, 153, 51, 0.3)',
      },
      backgroundImage: {
        'saffron-gradient': 'linear-gradient(135deg, #FF9933 0%, #E67300 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FDF6EC 0%, #F5E6D0 100%)',
        'temple-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config
