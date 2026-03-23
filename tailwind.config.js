/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./main.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        base: '#F9F8F6',
        main: '#1A1A1A',
        accent: '#2D4F3C',
        "accent-light": '#9BB8A5',
        "brand-lime": '#D4FF3E',
        muted: '#555555',
      }
    },
  },
  plugins: [],
}
