import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'apps/web-demo-packages',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5180,
    strictPort: false,
  },
  optimizeDeps: {
    include: ['@mieweb/forms-editor', '@mieweb/forms-renderer', '@mieweb/forms-engine']
  },
  build: { sourcemap: true }
});
