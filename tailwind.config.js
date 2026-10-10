/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c59d5f',
          light: '#d8b680',
          dark: '#b08745',
          muted: '#8a6e3e'
        },
        charcoal: {
          900: '#111111',
          800: '#181818',
          700: '#222222',
          600: '#2a2a2a'
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
