import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'apps/web-demo-packages',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@mieweb/forms-engine': new URL('../../packages/forms-engine/index.js', import.meta.url).pathname,
      '@mieweb/forms-editor': new URL('../../packages/forms-editor/index.js', import.meta.url).pathname,
      '@mieweb/forms-renderer': new URL('../../packages/forms-renderer/index.js', import.meta.url).pathname,
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    allowedHosts: true
  },
  optimizeDeps: {
    exclude: ['@mieweb/forms-editor', '@mieweb/forms-renderer', '@mieweb/forms-engine']
  },
  build: { sourcemap: true }
});
