import React from "react";
import ToolPanel from "./toolPanel/ToolPanel";
import EditPanel from "./editPanel/EditPanel";
import FormBuilderMain from "../FormBuilderMain";


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
        <div>
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
          <div className={`hidden lg:block`}>
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
          <div className={`lg:hidden`} >
            {isEditModalOpen && selectedField && (
              <div className="fixed inset-0 top-5 z-50 flex items-center justify-center bg-transparent/30 backdrop-blur-sm p-4"
                onClick={() => setEditModalOpen(false)}>
                <div className="w-full max-w-md mx-auto relative"
                  onClick={(e) => e.stopPropagation()}>
                  <button
                    className="absolute top-3 right-7 text-gray-500"
                    onClick={() => setEditModalOpen(false)}
                  >
                    <span className="text-3xl">&times;</span>
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
