/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#74C2F2', // Cheerful sky blue foundation
        surface: {
          DEFAULT: '#FFFAEE',    // Warm creamy beige/paper surfaces
          alt: '#E8DFCD',        // Light stone/wood surfaces
          indigo: '#E6F0F9',     // Soft sky-tinted surfaces
        },
        primary: '#65B93E',    // Juicy grass green (Gardenscapes core)
        secondary: '#3EA5EE',  // Bright sunny blue
        success: '#35C759',    // Vibrant emerald for wealth
        reward: '#FFD13B',     // Bright shiny gold
        warning: '#FF9500',    // Juicy orange for energy/quests
        danger: '#FF3B30',     // Cherry red risk
        text: {
          primary: '#422006',    // Rich chocolate brown for text
          secondary: '#785338',  // Soft warm brown for secondary text
          white: '#FFFFFF',      // Pure white text
        },
        border: '#D2C4A7',     // Earthy warm border for cards
        ring: '#65B93E',
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
