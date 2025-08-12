import { defineConfig } from 'vite'
import dns from 'node:dns'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: ['lattln-questionnaire-builder-main.opensource.mieweb.org']
    },
    plugins: [
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return;
                }
                warn(warning);
            },
        },
    },
})
