import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: 'apps/web-demo-packages',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@mieweb/forms-engine': path.resolve(__dirname, '../../packages/forms-engine/index.js'),
      '@mieweb/forms-editor': path.resolve(__dirname, '../../packages/forms-editor/index.js'),
      '@mieweb/forms-renderer': path.resolve(__dirname, '../../packages/forms-renderer/index.js'),
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
