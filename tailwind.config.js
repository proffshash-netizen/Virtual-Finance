/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080B14',
        surface: '#111827',
        elevated: '#182235',
        primary: '#7C5CFF',
        secondary: '#00D4FF',
        success: '#22C55E',
        reward: '#F5B942',
        warning: '#F97316',
        danger: '#EF4444',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: 'rgba(255, 255, 255, 0.1)',
        ring: '#7C5CFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
