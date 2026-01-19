import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const HtmlField = React.memo(function HtmlField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const [editMode, setEditMode] = React.useState(false);
  const [renderError, setRenderError] = React.useState(null);
  const iframeRef = React.useRef(null);
  const [iframeHeight, setIframeHeight] = React.useState(field.iframeHeight || 400);
  const [viewportWidth, setViewportWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Base height is set for desktop (~1024px width). As viewport narrows, content wraps more and needs more height.
  const getResponsiveHeight = React.useCallback((baseHeight) => {
    const referenceWidth = 1024;
    // Calculate how much narrower we are than reference
    // Narrower viewport = more text wrapping = need more height
    const widthRatio = referenceWidth / Math.max(viewportWidth, 320);
    // Scale height up as viewport gets smaller, dampen to ~0.35 for reduced scaling
    // At 1024px: multiplier = 1.0, at 512px: multiplier = 1.35, at 375px: ~1.61, at 320px: ~1.78
    const scaleFactor = 1 + (widthRatio - 1) * 0.35;
    return Math.round(baseHeight * Math.max(1, scaleFactor));
  }, [viewportWidth]);

  /**
   * Wrap HTML in a complete document for iframe rendering
   * Uses sandbox attribute to prevent scripts from escaping to parent
   */
  const wrapHTMLForIframe = React.useCallback((html) => {
    if (!html || typeof html !== "string") {
      return "";
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    html { padding: 24px 24px 0px 24px; margin: 0; }
    body { font-family: inherit; margin: 0; line-height: 1.5; }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  }, []);

  // Removed iframe error event handler useEffect; it does not catch HTML parsing errors in srcDoc.
  // Minimal debounce helper
  function debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Track viewport width for responsive height scaling
  React.useEffect(() => {
    const debouncedResize = debounce(() => setViewportWidth(window.innerWidth), 175);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  React.useEffect(() => {
    setRenderError(null);
  }, [field.htmlContent]);

  return (
    <FieldWrapper ctrl={ctrl} noPadding={ctrl.isPreview}>
      {({ api, isPreview, field: f }) => {
        if (isPreview) {
          const displayHeight = getResponsiveHeight(f.iframeHeight || 400);
          return (
            <>
              <iframe
                ref={iframeRef}
                srcDoc={wrapHTMLForIframe(f.htmlContent)}
                sandbox=""
                style={{
                  width: "100%",
                  border: "none",
                  height: `${displayHeight}px`,
                }}
                title="HTML Content"
              />
              {renderError && (
                <div role="alert" className="render-error mie:mt-2 mie:p-2 mie:bg-miedanger/10 mie:border mie:border-miedanger/30 mie:rounded mie:text-xs mie:text-miedanger">
                  {renderError}
                </div>
              )}
            </>
          );
        }

        // Edit mode
        return (
          <div className="mie:space-y-4 mie:w-full">
            {/* Editor/Preview Toggle */}
            <div className="mie:flex mie:gap-2">
              <button
                onClick={() => setEditMode(false)}
                className={`edit-mode-btn mie:px-4 mie:py-2 mie:rounded mie:transition-colors ${!editMode
                  ? "mie:bg-mieprimary mie:hover:bg-mieprimary/90 mie:text-miesurface"
                  : "mie:bg-miebackground mie:hover:bg-mieborder mie:text-mietext"
                  }`}
              >
                Edit
              </button>
              <button
                onClick={() => setEditMode(true)}
                className={`preview-mode-btn mie:px-4 mie:py-2 mie:rounded mie:transition-colors ${editMode
                  ? "mie:bg-mieprimary mie:hover:bg-mieprimary/90 mie:text-miesurface"
                  : "mie:bg-miebackground mie:hover:bg-mieborder mie:text-mietext"
                  }`}
              >
                Preview
              </button>
            </div>

            {/* Height Control */}
            <div>
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
                  onChange={(e) => {
                    const height = Math.max(50, Math.min(800, parseInt(e.target.value)));
                    setIframeHeight(height);
                    api.field.update("iframeHeight", height);
                  }}
                  className="height-slider mie:flex-1 mie:accent-mieprimary"
                  aria-label="Preview height in pixels"
                />
                <input
                  type="number"
                  min="50"
                  max="800"
                  step="10"
                  value={iframeHeight}
                  onChange={(e) => {
                    const height = parseInt(e.target.value) || 400;
                    setIframeHeight(Math.max(50, Math.min(800, height)));
                    api.field.update("iframeHeight", Math.max(50, Math.min(800, height)));
                  }}
                  className="height-input mie:w-20 mie:px-2 mie:py-1 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded mie:text-sm mie:text-center"
                  aria-label="Preview height in pixels"
                />
                <span className="height-unit mie:text-sm mie:text-mietextmuted">px</span>
              </div>
            </div>

            {editMode ? (
              // Preview Mode
              <div>
                <label className="preview-label mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-2">
                  Preview
                </label>
                <iframe
                  ref={iframeRef}
                  srcDoc={wrapHTMLForIframe(f.htmlContent)}
                  sandbox=""
                  style={{
                    width: "100%",
                    border: "1px solid var(--color-mieborder)",
                    height: `${getResponsiveHeight(iframeHeight)}px`,
                    background: "var(--color-miebackground)",
                  }}
                  title="HTML Preview"
                />
                {renderError && (
                  <div className="preview-error mie:mt-2 mie:p-2 mie:bg-miedanger/10 mie:border mie:border-miedanger/30 mie:rounded mie:text-xs mie:text-miedanger" role="alert">
                    {renderError}
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <div>
                <label className="edit-label mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-2">
                  HTML Content
                </label>
                <textarea
                  className="html-textarea mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors mie:font-mono mie:text-sm mie:max-h-64 mie:overflow-y-auto"
                  value={f.htmlContent || ""}
                  onChange={(e) => api.field.update("htmlContent", e.target.value)}
                  placeholder="Enter your HTML content here... (e.g., &lt;p&gt;text&lt;/p&gt;)"
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
