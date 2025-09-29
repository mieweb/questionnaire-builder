import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Demo app uses minimal config, inheriting from root configurations
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 5173,
  },
})