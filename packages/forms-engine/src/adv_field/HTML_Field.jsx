import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const HTML_Field = React.memo(function HTML_Field({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const [editMode, setEditMode] = React.useState(false);
  const [renderError, setRenderError] = React.useState(null);
  const iframeRef = React.useRef(null);
  const [iframeHeight, setIframeHeight] = React.useState(field.iframeHeight || 25);

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
    body { font-family: inherit; margin: 0; padding: 16px; line-height: 1.5; }
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

  // Listen for iframe errors
  React.useEffect(() => {
    const handleIframeError = (event) => {
      if (iframeRef.current && event.target === iframeRef.current) {
        setRenderError("Failed to render HTML content. Check for syntax errors.");
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("error", handleIframeError);
      return () => iframe.removeEventListener("error", handleIframeError);
    }
  }, []);

  // Clear error when content changes
  React.useEffect(() => {
    setRenderError(null);
  }, [field.htmlContent]);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f }) => {
        if (isPreview) {
          // Render mode - display in sandboxed iframe with saved height
          const displayHeight = f.iframeHeight || 25;
          return (
            <>
              <iframe
                ref={iframeRef}
                srcDoc={wrapHTMLForIframe(f.htmlContent)}
                sandbox=""
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "4px",
                  height: `${displayHeight}rem`,
                  maxHeight: "50vh",
                }}
                title="HTML Content"
              />
              {renderError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {renderError}
                </div>
              )}
            </>
          );
        }

        // Edit mode
        return (
          <div className="space-y-4 w-full">
            {/* Editor/Preview Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(false)}
                className={`px-4 py-2 rounded transition-colors ${!editMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
              >
                Edit
              </button>
              <button
                onClick={() => setEditMode(true)}
                className={`px-4 py-2 rounded transition-colors ${editMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
              >
                Preview
              </button>
            </div>

            {/* Height Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview Height (rem)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="3"
                  max="50"
                  step="0.5"
                  value={iframeHeight}
                  onChange={(e) => {
                    const height = parseFloat(e.target.value);
                    setIframeHeight(height);
                    api.field.update("iframeHeight", height);
                  }}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="3"
                  max="50"
                  step="0.5"
                  value={iframeHeight}
                  onChange={(e) => {
                    const height = parseFloat(e.target.value) || 25;
                    setIframeHeight(Math.max(3, Math.min(50, height)));
                    api.field.update("iframeHeight", Math.max(3, Math.min(50, height)));
                  }}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                />
                <span className="text-sm text-gray-500">rem</span>
              </div>
            </div>

            {editMode ? (
              // Preview Mode
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <iframe
                  ref={iframeRef}
                  srcDoc={wrapHTMLForIframe(f.htmlContent)}
                  sandbox=""
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: `${iframeHeight}rem`,
                    maxHeight: "50vh",
                    background: "#fafafa",
                  }}
                  title="HTML Preview"
                />
                {renderError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    {renderError}
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTML Content
                </label>
                <textarea
                  className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors font-mono text-sm"
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

export default HTML_Field;
