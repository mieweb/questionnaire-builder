/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/**/*.{html,js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        titillium: ['"Titillium Web"', 'sans-serif'],
        segoe: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}