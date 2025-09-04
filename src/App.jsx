import React, { useMemo, useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import MobileToolBar from "./components/MobileToolBar";
import ThreePanelLayout from "./components/desktopLayout/ThreePanelLayout";
import fieldTypes from "./fields/fieldTypes-config";

export default function App() {
  const [formData, setFormData] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [sectionHighlight, setSectionHighlight] = useState({});
  const getSectionHighlightId = (sectionId) => sectionHighlight[sectionId] || null;

  const setSectionActiveChild = useCallback((sid, cid) => {
    setSectionHighlight(prev => {
      if (prev[sid] === cid) return prev;
      return { ...prev, [sid]: cid };
    });
  }, []);

  const selectedField = useMemo(
    () => formData.find(f => f.id === selectedFieldId) || null,
    [formData, selectedFieldId]
  );

  useEffect(() => {
    setSectionHighlight({});
  }, [selectedFieldId, isPreview]);

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <Header
        formData={formData}
        setFormData={setFormData}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        selectedFieldId={selectedFieldId}
        setSelectedFieldId={setSelectedFieldId}
      />

      {/* Mobile ToolBar*/}
      <div className="lg:hidden">
        <MobileToolBar
          fieldTypes={fieldTypes}
          formData={formData}
          setFormData={setFormData}
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
        />
      </div>

      {/* Desktop / three-panel */}
      <ThreePanelLayout
        formData={formData}
        setFormData={setFormData}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        selectedFieldId={selectedFieldId}
        setSelectedFieldId={setSelectedFieldId}
        selectedField={selectedField}
        getSectionHighlightId={getSectionHighlightId}
        onActiveChildChange={setSectionActiveChild}
      />
    </div>
  );
}
