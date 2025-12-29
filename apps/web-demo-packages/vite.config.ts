import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === 'production' ? '/demos/' : '/',
  resolve: {
    alias: {
      '@mieweb/forms-engine': path.resolve(__dirname, '../../packages/forms-engine/index.js'),
      '@mieweb/forms-editor': path.resolve(__dirname, '../../packages/forms-editor/index.js'),
      '@mieweb/forms-renderer': path.resolve(__dirname, '../../packages/forms-renderer/index.js'),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: false,
    allowedHosts: true
  },
  optimizeDeps: {
    exclude: ['@mieweb/forms-editor', '@mieweb/forms-renderer', '@mieweb/forms-engine']
  }
});
