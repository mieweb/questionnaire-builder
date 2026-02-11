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
      name: 'inline-css-blaze',
      generateBundle(options, bundle) {
        const cssPath = resolve(__dirname, 'src/index.output.css');
        if (fs.existsSync(cssPath)) {
          const cssContent = fs.readFileSync(cssPath, 'utf-8');

          Object.keys(bundle).forEach(fileName => {
            if (fileName.endsWith('.js') && bundle[fileName].type === 'chunk') {
              const cssInjection = `
                                    (function() {
                                      if (typeof document === 'undefined') return;
                                      if (window.__QUESTIONNAIRE_BLAZE_CSS_INJECTED) return;
                                      if (!document.querySelector('#questionnaire-blaze-styles')) {
                                        const style = document.createElement('style');
                                        style.id = 'questionnaire-blaze-styles';
                                        style.textContent = ${JSON.stringify(cssContent)};
                                        document.head.appendChild(style);
                                      }
                                      window.__QUESTIONNAIRE_BLAZE_CSS_INJECTED = true;
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
      entry: resolve(__dirname, 'src/questionnaireRenderer-blaze.js'),
      name: 'QuestionnaireRendererBlaze',
      formats: ['es', 'umd'],
      fileName: (format) => `blaze.${format === 'es' ? 'js' : 'umd.cjs'}`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: false
  }
});
