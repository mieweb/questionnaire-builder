import React, { useMemo, useState, useCallback, useEffect } from "react";
import Header from "./components/Header";
import MobileToolBar from "./components/MobileToolBar";
import fieldTypes from "./fields/fieldTypes-config";
import Layout from "./components/desktopLayout/Layout.jsx";

import { useFormStore } from "./state/formStore"; 
export default function App() {

  const [isPreview, setIsPreview] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [sectionHighlight, setSectionHighlight] = useState({});
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const selectedField = useFormStore(
    React.useCallback((s) => (selectedFieldId ? s.byId[selectedFieldId] : null), [selectedFieldId])
  );

  const getSectionHighlightId = useCallback(
    (sectionId) => sectionHighlight[sectionId] || null,
    [sectionHighlight]
  );

  const setSectionActiveChild = useCallback((sid, cid) => {
    setSectionHighlight((prev) => (prev[sid] === cid ? prev : { ...prev, [sid]: cid }));
  }, []);

  useEffect(() => {
    setSectionHighlight({});
  }, [selectedFieldId, isPreview]);

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <Header
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        selectedFieldId={selectedFieldId}
        setSelectedFieldId={setSelectedFieldId}
      />

      {/* Mobile ToolBar */}
      <div className="lg:hidden">
        <MobileToolBar
          fieldTypes={fieldTypes}
          isPreview={isPreview}
          setIsPreview={setIsPreview}
        />
      </div>

      {/* Desktop / three-panel */}
      <Layout
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        selectedFieldId={selectedFieldId}
        setSelectedFieldId={setSelectedFieldId}
        selectedField={selectedField}
        getSectionHighlightId={getSectionHighlightId}
        onActiveChildChange={setSectionActiveChild}
        isEditModalOpen={isEditModalOpen}
        setEditModalOpen={setEditModalOpen}
      />
    </div>
  );
}
