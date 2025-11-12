import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const ImageField = React.memo(function ImageField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const [previewUrl, setPreviewUrl] = React.useState(field.imageUri || "");

  // Convert file to base64 when user selects image
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setPreviewUrl(base64String);
      ctrl.api.field.update("imageUri", base64String);
    };
    reader.readAsDataURL(file); // Reads as data URL (base64 encoded)
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
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

          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="pb-4">
                {imageUri && (
                  <div className={`flex ${alignmentClass} mb-4`}>
                    <img
                      src={imageUri}
                      alt={f.altText || "Image"}
                      className={`${sizeClass} h-auto object-contain`}
                    />
                  </div>
                )}
                {f.caption && <p className="text-sm text-gray-600 text-center mb-2">{f.caption}</p>}
              </div>
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
          <div className="space-y-3 w-full overflow-hidden">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                className="px-3 py-2 w-full border border-black/40 rounded"
                type="text"
                value={f.label || ""}
                onChange={(e) => api.field.update("label", e.target.value)}
                placeholder={placeholder?.label || "Image Block"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image (Upload or URL)
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-black/40 rounded text-sm"
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="text-gray-500 text-sm px-2">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-black/40 rounded text-sm"
                  value={f.imageUri || ""}
                  onChange={(e) => {
                    api.field.update("imageUri", e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="Image URL or base64 data"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                className="px-3 py-2 w-full border border-black/40 rounded"
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
                className="px-3 py-2 w-full border border-black/40 rounded"
                value={f.caption || ""}
                onChange={(e) => api.field.update("caption", e.target.value)}
                placeholder={placeholder?.caption || "Optional caption below image"}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <select
                  className="px-3 py-2 w-full border border-black/40 rounded"
                  value={f.size || "full"}
                  onChange={(e) => api.field.update("size", e.target.value)}
                >
                  <option value="small">Small (50% width)</option>
                  <option value="medium">Medium (75% width)</option>
                  <option value="full">Full (100% width)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alignment
                </label>
                <select
                  className="px-3 py-2 w-full border border-black/40 rounded"
                  value={f.alignment || "center"}
                  onChange={(e) => api.field.update("alignment", e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            {currentImageUri && (
              <div className="mt-4 p-3 border border-gray-200 rounded bg-gray-50 w-full overflow-hidden">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                <div className={`flex ${alignmentClass} mb-2`}>
                  <img
                    src={currentImageUri}
                    alt={f.altText || "Preview"}
                    className={`${sizeClass} h-auto object-contain max-w-full`}
                  />
                </div>
                {f.caption && <p className="text-sm text-gray-600 text-center">{f.caption}</p>}
              </div>
            )}
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default ImageField;
