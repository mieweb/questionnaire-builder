import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths to watch for package rebuilds (same pattern as docusaurus getPathsToWatch)
const packageDistPaths = [
  path.resolve(__dirname, '../../packages/forms-engine/dist'),
  path.resolve(__dirname, '../../packages/forms-editor/dist'),
  path.resolve(__dirname, '../../packages/forms-renderer/dist'),
];

// Watch package dist folders and reload on change
function watchPackages() {
  return {
    name: 'watch-packages',
    configureServer(server) {
      packageDistPaths.forEach(p => server.watcher.add(p));
      
      server.watcher.on('change', (file) => {
        if (packageDistPaths.some(dist => file.startsWith(dist))) {
          server.moduleGraph.invalidateAll();
          server.ws.send({ type: 'full-reload' });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), watchPackages()],
  base: '/',
  build: {
    outDir: 'build'
  },
  resolve: {
    alias: {
      '@mieweb/forms-engine': path.resolve(__dirname, '../../packages/forms-engine/dist/index.js'),
      '@mieweb/forms-editor': path.resolve(__dirname, '../../packages/forms-editor/dist/index.js'),
      '@mieweb/forms-renderer': path.resolve(__dirname, '../../packages/forms-renderer/dist/react.js'),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true,
    allowedHosts: true
  },
  optimizeDeps: {
    include: ['@mieweb/forms-editor', '@mieweb/forms-renderer', '@mieweb/forms-engine'],
    force: true
  }
});
