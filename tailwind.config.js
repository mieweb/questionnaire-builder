/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/**/*.{html,js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx}",
    "./apps/src/**/*.{js,jsx,ts,tsx}",
    "./apps/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        titillium: ['var(--font-titillium)', '"Titillium Web"', 'sans-serif'],
        segoe: ['var(--font-segoe)', '"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}