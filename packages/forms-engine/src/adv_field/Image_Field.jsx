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
            small: "mie:w-1/2",
            medium: "mie:w-3/4",
            full: "mie:w-full",
          }[f.size || "full"] || "mie:w-full";

          const alignmentClass = {
            left: "mie:justify-start",
            center: "mie:justify-center",
            right: "mie:justify-end",
          }[f.alignment || "center"] || "mie:justify-center";

          const previewPaddingClass = f.padding === "full-bleed" ? "" : "mie:pb-4";

          return (
            <div className={previewPaddingClass}>
              {f.question && <div className="mie:font-light mie:mb-2 mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question}</div>}
              {imageUri && (
                <div className={`mie:flex ${alignmentClass} ${f.padding !== "full-bleed" ? "mie:mb-4" : ""}`}>
                  <img
                    src={imageUri}
                    alt={f.altText || "Image"}
                    className={`${sizeClass} mie:h-auto mie:object-contain ${f.padding === "full-bleed" ? "mie:w-full" : ""}`}
                  />
                </div>
              )}
              {f.caption && <p className="mie:text-sm mie:text-mietextmuted mie:text-center mie:mb-2">{f.caption}</p>}
            </div>
          );
        }

        const currentImageUri = f.imageUri || previewUrl;
        const sizeClass = {
          small: "mie:w-1/2",
          medium: "mie:w-3/4",
          full: "mie:w-full",
        }[f.size || "full"] || "mie:w-full";

        const alignmentClass = {
          left: "mie:justify-start",
          center: "mie:justify-center",
          right: "mie:justify-end",
        }[f.alignment || "center"] || "mie:justify-center";

        return (
          <div ref={containerRef} tabIndex={-1} className="mie:space-y-3 mie:w-full mie:overflow-hidden">
            <div>
              <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
                Question / Title
              </label>
              <input
                type="text"
                value={f.question || ""}
                onChange={(e) => api.field.update("question", e.target.value)}
                placeholder={placeholder?.question || "Question / Title"}
                className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
              />
            </div>

            <div>
              <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                className="mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
                value={f.altText || ""}
                onChange={(e) => api.field.update("altText", e.target.value)}
                placeholder={placeholder?.altText || "Descriptive alt text for accessibility"}
              />
            </div>

            <div>
              <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
                Caption (Optional)
              </label>
              <input
                type="text"
                className="mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
                value={f.caption || ""}
                onChange={(e) => api.field.update("caption", e.target.value)}
                placeholder={placeholder?.caption || "Optional caption below image"}
              />
            </div>

            <div className="mie:grid mie:grid-cols-2 mie:gap-3">
              <div>
                <label className={`mie:block mie:text-sm mie:font-medium mie:mb-1 ${f.padding === "full-bleed" ? "mie:text-mietextmuted" : "mie:text-mietext"}`}>
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
                  disabled={f.padding === "full-bleed"}
                />
              </div>

              <div>
                <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
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
              <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-2">
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
              <div className="mie:p-4 mie:border mie:border-mieborder mie:rounded-lg mie:bg-miebackground mie:w-full mie:overflow-hidden mie:relative mie:shadow-sm">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    api.field.update("imageUri", "");
                    api.field.update("fileName", "");
                    setPreviewUrl("");
                    setFileName("");
                  }}
                  className="mie:absolute mie:top-3 mie:right-3 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                  title="Delete image"
                  aria-label="Delete image"
                >
                  <X_ICON className="mie:w-5 mie:h-5" />
                </button>
                <p className="mie:text-sm mie:font-semibold mie:text-mietext mie:mb-3">Preview</p>
                <div className={`mie:flex ${alignmentClass} mie:mb-2`}>
                  <img
                    src={currentImageUri}
                    alt={f.altText || "Preview"}
                    className={`${sizeClass} mie:h-auto mie:object-contain mie:max-w-full`}
                  />
                </div>
                {f.caption && <p className="mie:text-sm mie:text-mietextmuted mie:text-center mie:mb-2">{f.caption}</p>}
                {fileName && (
                  <p className="mie:text-xs mie:text-mietextmuted mie:border-t mie:border-mieborder mie:pt-2">
                    <span className="mie:font-medium">Source:</span> {fileName}
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
                  className="mie:hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mie:p-8 mie:border-2 mie:border-dashed mie:border-mieprimary/50 mie:rounded-lg mie:bg-linear-to-br mie:from-mieprimary/10 mie:to-miebackground mie:w-full mie:overflow-hidden mie:flex mie:items-center mie:justify-center mie:min-h-64 mie:cursor-pointer mie:hover:border-mieprimary mie:hover:from-mieprimary/20 mie:hover:to-miebackground mie:transition-all mie:shadow-sm"
                >
                  <div className="mie:text-center">
                    <UPLOAD_ICON className="mie:w-12 mie:h-12 mie:mx-auto mie:mb-3 mie:text-mieprimary" />
                    <p className="mie:text-lg mie:font-semibold mie:text-mietext mie:mb-2">Paste Image or Click to Upload</p>
                    <p className="mie:text-sm mie:text-mietextmuted">Press Ctrl+V (Cmd+V on Mac) to paste an image from your clipboard, or click here to select a file</p>
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
