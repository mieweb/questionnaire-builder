import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { resolve } from 'path';

/**
 * Standalone build configuration
 * Bundles React and all dependencies into a single file
 * For use in non-React environments (Meteor Blaze, Vue, Angular, vanilla JS)
 * No peer dependencies required!
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    libInjectCss()
  ],
  build: {
    emptyOutDir: false, // Don't clear dist folder
    lib: {
      entry: resolve(__dirname, 'src/web-component.js'),
      name: 'QuestionnaireRenderer',
      fileName: 'standalone',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Don't externalize anything - bundle everything
      external: [],
      output: {
        // For UMD build
        globals: {}
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    outDir: 'dist',
    // Force inline CSS
    assetsInlineLimit: 100000
  }
});
