/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        khansalar: {
          bg: '#050e1f',
          card: '#0a1a3b',
          surface: '#112959',
          border: '#1c3e7d',
          gold: {
            DEFAULT: '#e5b869',
            light: '#f5d898',
            dark: '#b88937',
            glow: 'rgba(229, 184, 105, 0.25)',
          },
          turquoise: {
            DEFAULT: '#00c8b3',
            light: '#38efd8',
            dark: '#009485',
            glow: 'rgba(0, 200, 179, 0.25)',
          },
          ruby: {
            DEFAULT: '#e63946',
            light: '#ff6b6b',
            dark: '#9b111e',
          }
        }
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -3px rgba(229, 184, 105, 0.35)',
        'turquoise-glow': '0 0 25px -3px rgba(0, 200, 179, 0.35)',
        'persian-card': '0 10px 30px -5px rgba(5, 14, 31, 0.7), 0 0 1px 1px rgba(229, 184, 105, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'fadeSlideUp 0.3s ease-out',
        'slide-down': 'fadeSlideDown 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'gentle-pulse': 'gentle-pulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeSlideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'gentle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
