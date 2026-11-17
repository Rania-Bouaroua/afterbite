/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#174C3C',
          50: '#EEF4F1',
          100: '#D7E6DE',
          200: '#AFCDBD',
          600: '#1D5C49',
          700: '#123D30',
          800: '#0E3026',
          900: '#0A241C',
        },
        sage: { DEFAULT: '#79A879', light: '#E3EFE0', dark: '#5E8F5E' },
        cream: { DEFAULT: '#F8F6EF', dark: '#EFEBDF', deep: '#E6E0CF' },
        tangerine: { DEFAULT: '#F29A54', light: '#FCE7D5', dark: '#B85E1C' },
        charcoal: { DEFAULT: '#252C29', soft: '#56605B', muted: '#7C857F' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,76,60,0.04), 0 8px 24px -12px rgba(23,76,60,0.18)',
        lift: '0 2px 4px rgba(23,76,60,0.05), 0 22px 44px -18px rgba(23,76,60,0.32)',
        float: '0 18px 50px -20px rgba(10,36,28,0.45)',
      },
      borderRadius: { '4xl': '2rem' },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pop: { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.25)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'slide-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        'fade-in': 'fade-in .25s ease-out both',
        'scale-in': 'scale-in .3s cubic-bezier(.2,.8,.2,1) both',
        'slide-up': 'slide-up .5s cubic-bezier(.2,.8,.2,1) both',
        'toast-in': 'toast-in .3s cubic-bezier(.2,.8,.2,1) both',
        pop: 'pop .35s ease-out',
        shimmer: 'shimmer 1.4s infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
