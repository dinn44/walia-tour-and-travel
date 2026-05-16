/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#141414",
        primary: "#d4af37", // Gold for a premium feel
        textMuted: "#a0a0a0"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        cinematic: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
