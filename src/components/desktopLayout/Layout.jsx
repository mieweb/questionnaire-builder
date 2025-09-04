import React from "react";
import ToolPanel from "./panels/ToolPanel";
import FormBuilderMain from "../FormBuilderMain";
import EditPanel from "./panels/EditPanel";

export default function Layout({
  formData,
  setFormData,
  isPreview,
  setIsPreview,
  selectedFieldId,
  setSelectedFieldId,
  selectedField,
  getSectionHighlightId,
  onActiveChildChange,
  isEditModalOpen,
  setEditModalOpen,
}) {

  const editPanelKey = selectedField
    ? `${selectedField.fieldType}:${selectedField.id}`
    : "empty";

  const editMode = !isPreview;
  const cols = editMode
    ? "lg:grid-cols-[280px_minmax(0,1fr)_320px]"
    : "lg:grid-cols-[minmax(0,1fr)]";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 h-fit rounded-lg mt-2">
      <div className={`grid grid-cols-1 ${cols} gap-3 h-full items-start`}>

        {/* Tool Panel */}
        {editMode && (
          <div className="hidden lg:block">
            <ToolPanel
              isPreview={isPreview}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        )}
        
        {/* Center Panel / Form Builder */} 
        <div className="overflow-y-auto h-[calc(100svh-19rem)] lg:h-[calc(100dvh-15rem)] custom-scrollbar px-1">
          <FormBuilderMain
            formData={formData}
            setFormData={setFormData}
            isPreview={isPreview}
            setIsPreview={setIsPreview}
            selectedFieldId={selectedFieldId}
            setSelectedFieldId={setSelectedFieldId}
            getSectionHighlightId={getSectionHighlightId}
            isEditModalOpen={isEditModalOpen}
            setEditModalOpen={setEditModalOpen}
          />
        </div>

        {/* Desktop EditPanel */}
        {editMode && (
          <div className={`hidden lg:block h-[calc(100svh-19rem)] lg:h-[calc(100dvh-15rem)] overflow-y-auto custom-scrollbar ${!selectedField ? "max-h-32" : ""}`}>
            <EditPanel
              key={editPanelKey}
              isPreview={isPreview}
              selectedField={selectedField}
              formData={formData}
              setFormData={setFormData}
              onActiveChildChange={onActiveChildChange}
            />
          </div>
        )}

        {/* Mobile EditPanel Modal */}
        {editMode && (
          <div className={`lg:hidden`}>
            {isEditModalOpen && selectedField && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-4 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500"
                    onClick={() => setEditModalOpen(false)}
                  >
                    ✕
                  </button>
                  <EditPanel
                    key={editPanelKey}
                    isPreview={isPreview}
                    selectedField={selectedField}
                    formData={formData}
                    setFormData={setFormData}
                    onActiveChildChange={onActiveChildChange}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
