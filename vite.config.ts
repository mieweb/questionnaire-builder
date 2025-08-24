import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: [
        'mieweb-questionnaire-builder-main.opensource.mieweb.org',
        'mieweb-questionnaire-builder-refactor/layout-desktop-panels.opensource.mieweb.org'
      ]
    },
    plugins: [
      tailwindcss(),
    ],
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
          warn(warning)
        },
      },
    },
  })