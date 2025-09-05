import React from "react";
import NonSectionEditor from "./types/NonSectionEditor";
import SectionEditor from "./types/SectionEditor";

export default function EditPanel({
  isPreview,
  selectedField,
  formData,
  setFormData,
  onActiveChildChange
}) {

  if (isPreview) return null;

  const isNone = !selectedField;
  const isSection = selectedField?.fieldType === "section";

  return (
    <div className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-2 overflow-y-auto custom-scrollbar 
                    ${selectedField ? "" : "max-h-32"} max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)]`}>

      {/* Placeholder */}
      {isNone && (
        <div className="text-gray-600">
          <h3 className="text-lg font-semibold mb-2">Edit</h3>
          <p>Select a field in the center panel to edit its properties.</p>
        </div>
      )}

      {/* Non-section editor */}
      {!isNone && !isSection && (
        <NonSectionEditor f={selectedField} formData={formData} setFormData={setFormData} />
      )}

      {/* Section editor */}
      {!isNone && isSection && (
        <SectionEditor section={selectedField} formData={formData} setFormData={setFormData} onActiveChildChange={onActiveChildChange} />
      )}
    </div>
  );
}
