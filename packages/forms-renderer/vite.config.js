import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

/**
 * React component build (lightweight, requires peer dependencies)
 */
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inline-css-react',
      generateBundle(options, bundle) {
        const cssPath = resolve(__dirname, 'src/styles.output.css');
        if (fs.existsSync(cssPath)) {
          const cssContent = fs.readFileSync(cssPath, 'utf-8');
          Object.keys(bundle).forEach(fileName => {
            if (fileName.endsWith('.js') && bundle[fileName].type === 'chunk') {
              const cssInjection = `
(function() {
  if (typeof document === 'undefined') return;
  if (window.__QUESTIONNAIRE_RENDERER_REACT_CSS_INJECTED) return;
  if (!document.querySelector('#questionnaire-renderer-react-styles')) {
    const style = document.createElement('style');
    style.id = 'questionnaire-renderer-react-styles';
    style.textContent = ${JSON.stringify(cssContent)};
    document.head.appendChild(style);
  }
  window.__QUESTIONNAIRE_RENDERER_REACT_CSS_INJECTED = true;
})();
`;
              bundle[fileName].code = cssInjection + bundle[fileName].code;
            }
          });
        }
      },
      writeBundle(outputOptions) {
        try {
          const outDir = resolve(__dirname, outputOptions?.dir || 'dist');
          if (!fs.existsSync(outDir)) return;
          const files = fs.readdirSync(outDir);
          files.forEach(f => {
            if (f.endsWith('.css')) {
              try { fs.unlinkSync(resolve(outDir, f)); } catch (e) { /* ignore */ }
            }
          });
        } catch (e) {
          // non-fatal
        }
      }
    }
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
      external: ['react', 'react-dom', '@mieweb/forms-engine', 'zustand'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mieweb/forms-engine': 'FormsEngine',
          zustand: 'zustand'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  }
});