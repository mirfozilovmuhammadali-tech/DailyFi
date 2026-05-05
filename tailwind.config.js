/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          card: 'rgba(20, 20, 20, 0.6)',
          border: 'rgba(255, 255, 255, 0.05)',
        },
        gold: {
          light: '#ffaa00',
          DEFAULT: '#ffd700',
        },
        cyan: {
          DEFAULT: '#00f5ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
