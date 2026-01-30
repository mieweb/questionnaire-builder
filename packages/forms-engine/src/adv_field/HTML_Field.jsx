import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const clampHeight = (value) => Math.max(50, Math.min(800, parseInt(value) || 400));

// Default theme values (light mode) - matches index.css
const DEFAULT_THEME_STYLES = `
  --mie-color-mietext: #111827;
  --mie-color-mietextmuted: #6b7280;
  --mie-color-miesurface: #ffffff;
  --mie-color-miebackground: #f9fafb;
  --mie-color-miebackgroundsecondary: #f3f4f6;
  --mie-color-mieborder: #e5e7eb;
  --mie-color-mieprimary: #3b82f6;
`;

// CSS variable names used for theming
const THEME_VARS = [
  '--mie-color-mietext',
  '--mie-color-mietextmuted',
  '--mie-color-miesurface',
  '--mie-color-miebackground',
  '--mie-color-miebackgroundsecondary',
  '--mie-color-mieborder',
  '--mie-color-mieprimary',
];

// Read CSS variable values from the root element
const getThemeStyles = (root) => {
  if (!root) return null;
  const style = getComputedStyle(root);
  return THEME_VARS.map(v => `${v}: ${style.getPropertyValue(v).trim()};`).join('\n      ');
};

// Check if HTML content has user-defined styles
const hasUserStyles = (html) => {
  if (!html || typeof html !== "string") return false;
  return /<style[\s>]/i.test(html) || /\sstyle\s*=/i.test(html);
};

const HtmlField = React.memo(function HtmlField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const [editMode, setEditMode] = React.useState(false);
  const containerRef = React.useRef(null);
  const [iframeHeight, setIframeHeight] = React.useState(field.iframeHeight || 400);
  const [viewportWidth, setViewportWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [themeStyles, setThemeStyles] = React.useState(DEFAULT_THEME_STYLES);

  // Theme detection - read CSS variables from editor/renderer root
  React.useEffect(() => {
    const updateTheme = () => {
      const root = containerRef.current?.closest('.qb-editor-root, .qb-renderer-root');
      const styles = getThemeStyles(root);
      if (styles) setThemeStyles(styles);
    };
    
    // Ref might not be ready on first render, retry next frame
    requestAnimationFrame(updateTheme);
    
    const root = containerRef.current?.closest('.qb-editor-root, .qb-renderer-root');
    if (root) {
      const observer = new MutationObserver(updateTheme);
      observer.observe(root, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, []);

  const getResponsiveHeight = React.useCallback((baseHeight) => {
    const widthRatio = 1024 / Math.max(viewportWidth, 320);
    const scaleFactor = 1 + (widthRatio - 1) * 0.35;
    return Math.round(baseHeight * Math.max(1, scaleFactor));
  }, [viewportWidth]);

  const wrapHTMLForIframe = React.useCallback((html, styles) => {
    if (!html || typeof html !== "string") return "";

    const defaultStyles = hasUserStyles(html) ? '' : `
    body { color: var(--mie-color-mietext); background-color: var(--mie-color-miesurface); }
    a { color: var(--mie-color-mieprimary); }
    a:hover { text-decoration: underline; }
    h1, h2, h3, h4, h5, h6 { color: var(--mie-color-mietext); margin-top: 1em; margin-bottom: 0.5em; font-weight: 600; }
    h1 { font-size: 1.875rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    p { margin: 0.75em 0; }
    ul, ol { padding-left: 1.5em; margin: 0.75em 0; }
    li { margin: 0.25em 0; }
    blockquote { border-left: 3px solid var(--mie-color-mieborder); padding-left: 1em; margin: 1em 0; color: var(--mie-color-mietextmuted); }
    code { background: var(--mie-color-miebackgroundsecondary); padding: 0.125em 0.375em; border-radius: 0.25em; font-size: 0.875em; }
    pre { background: var(--mie-color-miebackgroundsecondary); padding: 1em; border-radius: 0.375em; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    hr { border: none; border-top: 1px solid var(--mie-color-mieborder); margin: 1.5em 0; }`;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root { ${styles} }
    html { padding: 24px 24px 0 24px; margin: 0; }
    body { font-family: inherit; margin: 0; line-height: 1.5; }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid var(--mie-color-mieborder); padding: 8px; text-align: left; }
    th { background: var(--mie-color-miebackgroundsecondary); }${defaultStyles}
  </style>
</head>
<body>${html}</body>
</html>`;
  }, []);

  React.useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setViewportWidth(window.innerWidth), 175);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const updateHeight = (api, value) => {
    const height = clampHeight(value);
    setIframeHeight(height);
    api.field.update("iframeHeight", height);
  };

  const ToggleButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`toggle-btn mie:px-4 mie:py-2 mie:rounded mie:border-0 mie:outline-none mie:focus:outline-none mie:cursor-pointer mie:transition-colors ${
        active
          ? "mie:bg-mieprimary mie:hover:bg-mieprimary/90 mie:text-mietextsecondary"
          : "mie:bg-miebackgroundsecondary mie:hover:bg-miebackgroundhover mie:text-mietext"
      }`}
    >
      {children}
    </button>
  );

  return (
    <FieldWrapper ctrl={ctrl} noPadding={ctrl.isPreview}>
      {({ api, isPreview, field: f }) => {
        if (isPreview) {
          return (
            <div ref={containerRef} className="html-field-preview">
              <iframe
                srcDoc={wrapHTMLForIframe(f.htmlContent, themeStyles)}
                sandbox=""
                style={{ width: "100%", border: "none", height: `${getResponsiveHeight(f.iframeHeight || 400)}px` }}
                title="HTML Content"
              />
            </div>
          );
        }

        return (
          <div ref={containerRef} className="html-field-editor mie:space-y-4 mie:w-full mie:bg-miesurface">
            <div className="toggle-buttons mie:flex mie:gap-2">
              <ToggleButton active={!editMode} onClick={() => setEditMode(false)}>Edit</ToggleButton>
              <ToggleButton active={editMode} onClick={() => setEditMode(true)}>Preview</ToggleButton>
            </div>

            <div className="height-control">
              <label className="height-control-label mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
                Preview Height (px)
              </label>
              <div className="height-control-inputs mie:flex mie:gap-2 mie:items-center">
                <input
                  type="range"
                  min="50"
                  max="800"
                  step="10"
                  value={iframeHeight}
                  onChange={(e) => updateHeight(api, e.target.value)}
                  className="height-slider mie:flex-1 mie:accent-mieprimary mie:bg-transparent mie:cursor-pointer"
                  aria-label="Preview height in pixels"
                />
                <input
                  type="number"
                  min="50"
                  max="800"
                  step="10"
                  value={iframeHeight}
                  onChange={(e) => updateHeight(api, e.target.value)}
                  className="height-input mie:w-20 mie:px-2 mie:py-1 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded mie:text-sm mie:text-center mie:outline-none mie:focus:border-mieprimary"
                  aria-label="Preview height in pixels"
                />
                <span className="height-unit mie:text-sm mie:text-mietextmuted">px</span>
              </div>
            </div>

            {editMode ? (
              <div className="preview-section">
                <label className="preview-label mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-2">Preview</label>
                <iframe
                  srcDoc={wrapHTMLForIframe(f.htmlContent, themeStyles)}
                  sandbox=""
                  style={{
                    width: "100%",
                    border: "1px solid var(--mie-color-mieborder)",
                    height: `${getResponsiveHeight(iframeHeight)}px`,
                    background: "var(--mie-color-miebackground)",
                  }}
                  title="HTML Preview"
                />
              </div>
            ) : (
              <div className="edit-section">
                <label className="edit-label mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-2">HTML Content</label>
                <textarea
                  className="html-textarea mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors mie:font-mono mie:text-sm mie:max-h-64 mie:overflow-y-auto"
                  value={f.htmlContent || ""}
                  onChange={(e) => api.field.update("htmlContent", e.target.value)}
                  placeholder="Enter your HTML content here... (e.g., <p>text</p>)"
                  rows={8}
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
            )}
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default HtmlField;
