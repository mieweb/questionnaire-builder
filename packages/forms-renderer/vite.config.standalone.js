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
      name: 'inline-css',
      generateBundle(options, bundle) {
        const cssPath = resolve(__dirname, 'src/index.output.css');
        if (fs.existsSync(cssPath)) {
          const cssContent = fs.readFileSync(cssPath, 'utf-8');

          Object.keys(bundle).forEach(fileName => {
            if (fileName.endsWith('.js') && bundle[fileName].type === 'chunk') {
              const cssInjection = `
(function() {
  if (typeof document === 'undefined') return;
  if (window.__QUESTIONNAIRE_RENDERER_CSS_INJECTED) return;
  if (!document.querySelector('#questionnaire-renderer-styles')) {
    const style = document.createElement('style');
    style.id = 'questionnaire-renderer-styles';
    style.textContent = ${JSON.stringify(cssContent)};
    document.head.appendChild(style);
  }
  window.__QUESTIONNAIRE_RENDERER_CSS_INJECTED = true;
})();
`;
              bundle[fileName].code = cssInjection + bundle[fileName].code;
            }
          });
        }
      },
      // After files are written, remove any emitted CSS files from the outDir to
      // avoid leaving a separate .css file and causing duplicate styles when the
      // bundle is used standalone.
      writeBundle(outputOptions) {
        try {
          const outDir = resolve(__dirname, outputOptions?.dir || 'dist');
          if (!fs.existsSync(outDir)) return;
          const files = fs.readdirSync(outDir);
          files.forEach(f => {
            if (f.endsWith('.css')) {
              try { fs.unlinkSync(resolve(outDir, f)); } catch (_e) { /* ignore */ }
            }
          });
        } catch (_e) {
          // non-fatal
        }
      }
    }
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    emptyOutDir: false,
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'src/questionnaireRenderer-web.js'),
      name: 'QuestionnaireRenderer',
      fileName: 'standalone',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: []
    },
    cssCodeSplit: false,
    sourcemap: false
  }
});
