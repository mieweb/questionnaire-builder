import React from "react";
import ToolPanel from "./panels/ToolPanel";
import FormBuilderMain from "../FormBuilderMain";
import EditPanel from "./panels/EditPanel";

export default function ThreePanelLayout({
  formData,
  setFormData,
  isPreview,
  setIsPreview,
  selectedFieldId,
  setSelectedFieldId,
  selectedField,
}) {
  const editMode = !isPreview;
  const cols = editMode
    ? "lg:grid-cols-[280px_minmax(0,1fr)_320px]"
    : "lg:grid-cols-[minmax(0,1fr)]";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 h-fit rounded-lg mt-2">
      <div className={`grid grid-cols-1 ${cols} gap-3 h-full items-start`}>

        {editMode && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hidden lg:block">
            <ToolPanel
              isPreview={isPreview}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        )}

        <div className="overflow-y-auto h-[calc(100svh-19rem)] lg:h-[calc(100dvh-15rem)] custom-scrollbar rounded-lg px-1">
          <FormBuilderMain
            formData={formData}
            setFormData={setFormData}
            isPreview={isPreview}
            setIsPreview={setIsPreview}
            selectedFieldId={selectedFieldId}
            setSelectedFieldId={setSelectedFieldId}
          />
        </div>
        {editMode && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm hidden lg:block">
            <EditPanel
              isPreview={isPreview}
              selectedField={selectedField}
              formData={formData}
              setFormData={setFormData}
              selectedFieldId={selectedFieldId}
              setSelectedFieldId={setSelectedFieldId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
