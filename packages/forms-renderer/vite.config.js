import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * React component build (lightweight, requires peer dependencies)
 * CSS is now pre-processed by Tailwind CLI
 */
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'FormsRenderer',
      fileName: 'react',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@mieweb/forms-engine'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mieweb/forms-engine': 'FormsEngine'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  }
});