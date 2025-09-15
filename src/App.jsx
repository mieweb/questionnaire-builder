// App.jsx
import React, { useEffect } from "react";
import Header from "./components/Header";
import MobileToolBar from "./components/MobileToolBar";
import Layout from "./components/desktopLayout/Layout.jsx";
import { useFormStore } from "./state/formStore";
import { useUIStore } from "./state/uiStore";

export default function App() {
  const isPreview = useUIStore((s) => s.isPreview);
  const selectedFieldId = useUIStore((s) => s.selectedFieldId);
  const clearSectionHighlights = useUIStore((s) => s.clearSectionHighlights);

  const selectedField = useFormStore(
    React.useCallback(
      (s) => (selectedFieldId ? s.byId[selectedFieldId] : null),
      [selectedFieldId]
    )
  );
  
  useEffect(() => {
    clearSectionHighlights();
  }, [selectedFieldId, isPreview, clearSectionHighlights]);

  return (
    <div className="min-h-screen bg-gray-100 font-titillium">
      <Header />
      <div className="lg:hidden">
        <MobileToolBar />
      </div>
      <Layout selectedField={selectedField} />
    </div>
  );
}
