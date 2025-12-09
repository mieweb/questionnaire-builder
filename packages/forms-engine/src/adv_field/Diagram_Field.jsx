import React from "react";
import CustomDropdown from "../helper_shared/CustomDropdown";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import DrawingCanvas from "../helper_shared/DrawingCanvas";
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
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="px-6 pt-6 pb-2">
                <div className="font-light mb-2 break-words overflow-hidden">{f.question || "Question"}</div>
              </div>
              <div className="flex justify-center mx-auto px-2 pb-2 lg:px-6 lg:pb-4">
                <div className="w-full max-w-[80vw] md:max-w-[75vw] lg:max-w-full">
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
          <div ref={containerRef} tabIndex={-1} className="space-y-3">
            <input
              className="px-3 py-2 h-10 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
            />

            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Diagram Settings
              </label>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={f.placeholder || ""}
                    onChange={(e) => api.field.update("placeholder", e.target.value)}
                    placeholder={placeholder?.pad || "e.g., Draw on the diagram"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Background Diagram Image
                  </label>

                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-2">
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
                    <div className="p-3 border border-gray-300 rounded-lg bg-white relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          api.field.update("diagramImage", "");
                          api.field.update("fileName", "");
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove diagram"
                      >
                        <X_ICON className="w-5 h-5" />
                      </button>
                      <img
                        src={f.diagramImage}
                        alt="Diagram background"
                        className="w-full h-auto max-h-48 object-contain"
                      />
                      {f.fileName && (
                        <p className="text-xs text-gray-500 mt-2">
                          <span className="font-medium">File:</span> {f.fileName}
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
                        className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        <div className="text-center">
                          <UPLOAD_ICON className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Upload Diagram or Paste
                          </p>
                          <p className="text-xs text-gray-500">
                            Click to select or press Ctrl+V to paste
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="required-diagram"
                    checked={f.required === true}
                    onChange={(e) => api.field.update("required", e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="required-diagram" className="text-sm text-gray-700 cursor-pointer">
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
