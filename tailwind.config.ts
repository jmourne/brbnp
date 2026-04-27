import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barbarian: {
          red: '#e31b23',
          dark: '#09090b',
          zinc: '#18181b',
        }
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      }
    }
  },
  plugins: [],
} satisfies Config
