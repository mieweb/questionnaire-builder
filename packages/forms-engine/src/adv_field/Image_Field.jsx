import React from "react";
import CustomDropdown from "../helper_shared/CustomDropdown";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import { UPLOAD_ICON, X_ICON } from "../helper_shared/icons";

const ImageField = React.memo(function ImageField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const [previewUrl, setPreviewUrl] = React.useState(field.imageUri || "");
  const [fileName, setFileName] = React.useState(field.fileName || "");
  const containerRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  // Convert file to base64 when user selects image
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setPreviewUrl(base64String);
      setFileName(file.name);
      ctrl.api.field.update("imageUri", base64String);
      ctrl.api.field.update("fileName", file.name);
    };
    reader.readAsDataURL(file); // Reads as data URL (base64 encoded)
  };

  // Handle pasted images from clipboard
  const handlePaste = React.useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target.result;
          setPreviewUrl(base64String);
          setFileName(""); // Clear fileName for pasted images
          ctrl.api.field.update("imageUri", base64String);
          ctrl.api.field.update("fileName", "");
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  }, [ctrl.api.field]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || ctrl.isPreview) return;

    container.addEventListener("paste", handlePaste);
    return () => container.removeEventListener("paste", handlePaste);
  }, [handlePaste, ctrl.isPreview]);

  return (
    <FieldWrapper ctrl={ctrl} noPadding={ctrl.isPreview && field.padding === "full-bleed"}>
      {({ api, isPreview, field: f, placeholder }) => {
        if (isPreview) {
          const imageUri = f.imageUri || previewUrl;
          const sizeClass = {
            small: "w-1/2",
            medium: "w-3/4",
            full: "w-full",
          }[f.size || "full"] || "w-full";

          const alignmentClass = {
            left: "justify-start",
            center: "justify-center",
            right: "justify-end",
          }[f.alignment || "center"] || "justify-center";

          const previewPaddingClass = f.padding === "full-bleed" ? "" : "pb-4";

          return (
            <div className={previewPaddingClass}>
              {f.question && <div className="font-light mb-2 break-words overflow-hidden">{f.question}</div>}
              {imageUri && (
                <div className={`flex ${alignmentClass} ${f.padding !== "full-bleed" ? "mb-4" : ""}`}>
                  <img
                    src={imageUri}
                    alt={f.altText || "Image"}
                    className={`${sizeClass} h-auto object-contain ${f.padding === "full-bleed" ? "w-full" : ""}`}
                  />
                </div>
              )}
              {f.caption && <p className="text-sm text-gray-600 text-center mb-2">{f.caption}</p>}
            </div>
          );
        }

        const currentImageUri = f.imageUri || previewUrl;
        const sizeClass = {
          small: "w-1/2",
          medium: "w-3/4",
          full: "w-full",
        }[f.size || "full"] || "w-full";

        const alignmentClass = {
          left: "justify-start",
          center: "justify-center",
          right: "justify-end",
        }[f.alignment || "center"] || "justify-center";

        return (
          <div ref={containerRef} tabIndex={-1} className="space-y-3 w-full overflow-hidden">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question / Title
              </label>
              <input
                className="px-3 py-2 h-10 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                value={f.altText || ""}
                onChange={(e) => api.field.update("altText", e.target.value)}
                placeholder={placeholder?.altText || "Descriptive alt text for accessibility"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption (Optional)
              </label>
              <input
                type="text"
                className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                value={f.caption || ""}
                onChange={(e) => api.field.update("caption", e.target.value)}
                placeholder={placeholder?.caption || "Optional caption below image"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${f.padding === "full-bleed" ? "text-gray-400" : "text-gray-700"}`}>
                  Size
                </label>
                <CustomDropdown
                  options={[
                    { id: "small", value: "Small (50% width)" },
                    { id: "medium", value: "Medium (75% width)" },
                    { id: "full", value: "Full (100% width)" }
                  ]}
                  value={f.size || "full"}
                  onChange={(id) => api.field.update("size", id)}
                  placeholder="Select size"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alignment
                </label>
                <CustomDropdown
                  options={[
                    { id: "left", value: "Left" },
                    { id: "center", value: "Center" },
                    { id: "right", value: "Right" }
                  ]}
                  value={f.alignment || "center"}
                  onChange={(id) => api.field.update("alignment", id)}
                  placeholder="Select alignment"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Padding
              </label>
              <CustomDropdown
                options={[
                  { id: "padded", value: "Padded (default)" },
                  { id: "full-bleed", value: "Full Bleed (no padding)" }
                ]}
                value={f.padding || "padded"}
                onChange={(id) => api.field.update("padding", id)}
                placeholder="Select padding"
              />
            </div>

            {currentImageUri ? (
              <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 w-full overflow-hidden relative shadow-sm">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    api.field.update("imageUri", "");
                    api.field.update("fileName", "");
                    setPreviewUrl("");
                    setFileName("");
                  }}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete image"
                  aria-label="Delete image"
                >
                  <X_ICON className="w-5 h-5" />
                </button>
                <p className="text-sm font-semibold text-gray-700 mb-3">Preview</p>
                <div className={`flex ${alignmentClass} mb-2`}>
                  <img
                    src={currentImageUri}
                    alt={f.altText || "Preview"}
                    className={`${sizeClass} h-auto object-contain max-w-full`}
                  />
                </div>
                {f.caption && <p className="text-sm text-gray-600 text-center mb-2">{f.caption}</p>}
                {fileName && (
                  <p className="text-xs text-gray-500 border-t pt-2">
                    <span className="font-medium">Source:</span> {fileName}
                  </p>
                )}
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-blue-300 rounded-lg bg-gradient-to-br from-blue-50 to-gray-50 w-full overflow-hidden flex items-center justify-center min-h-64 cursor-pointer hover:border-blue-400 hover:from-blue-100 hover:to-gray-100 transition-all shadow-sm"
                >
                  <div className="text-center">
                    <UPLOAD_ICON className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">Paste Image or Click to Upload</p>
                    <p className="text-sm text-gray-500">Press Ctrl+V (Cmd+V on Mac) to paste an image from your clipboard, or click here to select a file</p>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default ImageField;
