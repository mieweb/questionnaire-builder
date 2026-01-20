import React from "react";
import CustomDropdown from "../helper_shared/CustomDropdown";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import DrawingCanvas from "../helper_shared/DrawingCanvas";
import CustomCheckbox from "../helper_shared/CustomCheckbox";
import { UPLOAD_ICON, X_ICON } from "../helper_shared/icons";
import maleChart from "../assets/body-male.png";
import femaleChart from "../assets/body-female.png";
import neutralChart from "../assets/body-neutral.png";
import headChart from "../assets/head.png";
import handsChart from "../assets/hands.png";
import feetChart from "../assets/feet.png";
import dentalChart from "../assets/dental_chart.webp";

// Preset diagrams configuration
const DIAGRAM_PRESETS = [
  { id: "male", label: "Male Body", image: maleChart },
  { id: "female", label: "Female Body", image: femaleChart },
  { id: "neutral", label: "Neutral Body", image: neutralChart },
  { id: "head", label: "Head", image: headChart },
  { id: "hands", label: "Hands", image: handsChart },
  { id: "feet", label: "Feet", image: feetChart },
  { id: "dental", label: "Dental", image: dentalChart },
];

const DiagramField = React.memo(function DiagramField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const fileInputRef = React.useRef(null);
  const containerRef = React.useRef(null);

  // Helper to determine which preset is selected
  const getSelectedPreset = () => {
    const preset = DIAGRAM_PRESETS.find(p => p.image === field.diagramImage);
    return preset?.id || "";
  };

  const handleMarkupChange = (data) => {
    // data is { strokes: string, image: string }
    if (typeof data === "string") {
      // Legacy format or clear
      ctrl.api.field.update("markupData", data);
      ctrl.api.field.update("markupImage", "");
    } else {
      // New hybrid format
      ctrl.api.field.update("markupData", data.strokes);
      ctrl.api.field.update("markupImage", data.image);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      ctrl.api.field.update("diagramImage", base64String);
      ctrl.api.field.update("fileName", file.name);
    };
    reader.readAsDataURL(file);
  };

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
          ctrl.api.field.update("diagramImage", base64String);
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
    <FieldWrapper ctrl={ctrl} noPadding={ctrl.isPreview === true ? true : false}>
      {({ api, isPreview, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div>
              <div className="mie:px-6 mie:pt-6 mie:pb-2">
                <div className="mie:font-light mie:mb-2 mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
              </div>
              <div className="mie:flex mie:justify-center mie:mx-auto mie:px-2 mie:pb-2 mie:lg:px-6 mie:lg:pb-4">
                <div className="mie:w-full mie:max-w-[80vw] mie:md:max-w-[75vw] mie:lg:max-w-full">
                  <DrawingCanvas
                    onDrawingChange={handleMarkupChange}
                    existingDrawing={f.markupData}
                    backgroundImage={f.diagramImage}
                    placeholder={f.placeholder || "Draw on the diagram"}
                    mode="diagram"
                    config={{
                      width: 640,
                      height: 400,
                      strokeColor: "#FF0000",
                      strokeWidth: 3,
                      eraserWidth: 20,
                      hasEraser: true,
                      showControls: true,
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div ref={containerRef} tabIndex={-1} className="mie:space-y-3">
            <input
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Question / Title"}
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
            />

            <div className="mie:p-4 mie:border mie:border-mieborder mie:rounded-lg mie:bg-miebackground mie:shadow-sm">
              <label className="mie:block mie:text-sm mie:font-semibold mie:text-mietext mie:mb-3">
                Diagram Settings
              </label>

              <div className="mie:space-y-3">
                <div>
                  <label className="mie:block mie:text-sm mie:text-mietextmuted mie:mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={f.placeholder || ""}
                    onChange={(e) => api.field.update("placeholder", e.target.value)}
                    placeholder={placeholder?.pad || "e.g., Draw on the diagram"}
                    className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors mie:bg-miesurface mie:text-mietext"
                  />
                </div>

                <div>
                  <label className="mie:block mie:text-sm mie:text-mietextmuted mie:mb-2">
                    Background Diagram Image
                  </label>

                  <div className="mie:mb-3">
                    <label className="mie:block mie:text-sm mie:text-mietextmuted mie:mb-2">
                      Quick Presets
                    </label>
                    <CustomDropdown
                      options={DIAGRAM_PRESETS.map(preset => ({
                        id: preset.id,
                        value: preset.label
                      }))}
                      value={getSelectedPreset()}
                      onChange={(presetId) => {
                        const preset = DIAGRAM_PRESETS.find(p => p.id === presetId);
                        if (preset) {
                          api.field.update("diagramImage", preset.image);
                          api.field.update("fileName", preset.label);
                        }
                      }}
                      placeholder="Select a diagram..."
                      showClearOption={true}
                    />
                  </div>
                  
                  {f.diagramImage ? (
                    <div className="mie:p-3 mie:border mie:border-mieborder mie:rounded-lg mie:bg-miesurface mie:relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          api.field.update("diagramImage", "");
                          api.field.update("fileName", "");
                        }}
                        className="mie:absolute mie:top-2 mie:right-2 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                        title="Remove diagram"
                      >
                        <X_ICON className="mie:w-5 mie:h-5" />
                      </button>
                      <img
                        src={f.diagramImage}
                        alt="Diagram background"
                        className="mie:w-full mie:h-auto mie:max-h-48 mie:object-contain"
                      />
                      {f.fileName && (
                        <p className="mie:text-xs mie:text-mietextmuted mie:mt-2">
                          <span className="mie:font-medium">File:</span> {f.fileName}
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
                        className="mie:p-6 mie:border-2 mie:border-dashed mie:border-mieborder mie:rounded-lg mie:bg-miesurface mie:hover:border-mieprimary mie:hover:bg-mieprimary/10 mie:transition-all mie:cursor-pointer"
                      >
                        <div className="mie:text-center">
                          <UPLOAD_ICON className="mie:w-8 mie:h-8 mie:mx-auto mie:mb-2 mie:text-mietextmuted" />
                          <p className="mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
                            Upload Diagram or Paste
                          </p>
                          <p className="mie:text-xs mie:text-mietextmuted">
                            Click to select or press Ctrl+V to paste
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mie:flex mie:items-center mie:gap-2">
                  <CustomCheckbox
                    id="required-diagram"
                    checked={f.required === true}
                    onChange={(checked) => api.field.update("required", checked)}
                    size="md"
                  />
                  <label htmlFor="required-diagram" className="mie:text-sm mie:text-mietext mie:cursor-pointer">
                    Required diagram
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default DiagramField;
