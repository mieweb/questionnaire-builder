import React, { useState, useMemo } from "react";
import FormBuilderMain from "./components/FormBuilderMain";
import Header from "./components/Header";
import MobileToolBar from "./components/MobileToolBar";
import fieldTypes from "./fields/fieldTypes-config";
import { addField, deleteField, updateField } from "./utils/formActions";

import ThreePanelLayout from "./components/layouts/ThreePanelLayout";
import ToolPanel from "./components/panels/ToolPanel";
import EditPanel from "./components/panels/EditPanel";

const App = () => {
  const [formData, setFormData] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const selectedField = useMemo(
    () => formData.find(f => f.id === selectedFieldId) || null,
    [formData, selectedFieldId]
  );

  const handleUpdateField = (id, key, value) =>
    updateField(formData, setFormData, id, key, value);

  const handleDeleteField = (id) => {
    deleteField(formData, setFormData, id);
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleAddField = (type) => addField(formData, setFormData, type);

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <Header formData={formData} setFormData={setFormData} isPreview={isPreview} setIsPreview={setIsPreview} />

      {/* Mobile toolbar kept for small screens; desktop uses the panels */}
      <div className="lg:hidden">
        <MobileToolBar
          fieldTypes={fieldTypes}
          formData={formData}
          setFormData={setFormData}
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          onAdd={handleAddField}
        />
      </div>

      {/* Desktop / wide layout */}
      <div className="hidden lg:block">
        <ThreePanelLayout
          left={
            <ToolPanel onAdd={handleAddField} isPreview={isPreview} />
          }
          center={
            <div className="FormBuilder-Container">
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
          }
          right={
            <EditPanel
              selectedField={selectedField}
              onUpdate={(id, key, value) => handleUpdateField(id, key, value)}
              isPreview={isPreview}
            />
          }
        />
      </div>
    </div>
  );
};

export default App;
