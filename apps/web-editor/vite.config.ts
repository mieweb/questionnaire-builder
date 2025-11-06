import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  root: 'apps/web-editor',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: false,
    allowedHosts: true
  },
  optimizeDeps: {
    // Ensure internal pkgs get pre-bundled if they contain JSX/modern syntax
    include: ['@mieweb/forms-editor', '@mieweb/forms-engine'],
  },
  build: {
    sourcemap: true,
  },
});