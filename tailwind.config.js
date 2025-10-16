/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './packages/*/src/**/*.{js,jsx,ts,tsx}',
    './apps/*/src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'titillium': ['Titillium Web', 'sans-serif']
      }
    }
  },
  plugins: []
}