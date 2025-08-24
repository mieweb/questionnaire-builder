import React from "react";
import ToolPanel from "./panels/ToolPanel";
import FormBuilderMain from "../FormBuilderMain"; 
import EditPanel from "./panels/EditPanel";

export default function ThreePanelLayout({ isPreview }) {

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-24">

      <ToolPanel onAdd={handleAddField} />

      <div>
        <FormBuilderMain
          formData={formData}
          setFormData={setFormData}
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          updateField={handleUpdateField}
          deleteField={handleDeleteField}
          onSelectField={(id) => setSelectedFieldId(id)}
          selectedFieldId={selectedFieldId}
        />
      </div>

      <EditPanel
        selectedField={selectedField}
        onUpdate={(id, key, value) => handleUpdateField(id, key, value)}
      />
    </div>
  );
}

