import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    libInjectCss()
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'FormsEditor',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@mieweb/forms-engine', 'framer-motion', 'js-yaml'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mieweb/forms-engine': 'FormsEngine',
          'framer-motion': 'FramerMotion',
          'js-yaml': 'jsyaml'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  }
});