import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'inline-css-engine',
      generateBundle(options, bundle) {
        const cssPath = resolve(__dirname, 'src/index.output.css');
        if (fs.existsSync(cssPath)) {
          const cssContent = fs.readFileSync(cssPath, 'utf-8');
          
          Object.keys(bundle).forEach(fileName => {
            if (fileName.endsWith('.js') && bundle[fileName].type === 'chunk') {
              const cssInjection = `
                                    (function() {
                                      if (typeof document === 'undefined') return;
                                      if (window.__QUESTIONNAIRE_ENGINE_CSS_INJECTED) return;
                                      if (!document.querySelector('#questionnaire-engine-styles')) {
                                        const style = document.createElement('style');
                                        style.id = 'questionnaire-engine-styles';
                                        style.textContent = ${JSON.stringify(cssContent)};
                                        document.head.appendChild(style);
                                      }
                                      window.__QUESTIONNAIRE_ENGINE_CSS_INJECTED = true;
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
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'FormsEngine',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'zustand'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          zustand: 'zustand'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: false
  }
});