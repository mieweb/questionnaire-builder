import React, { useEffect } from "react";
import Header from "./components/Header";
import MobileToolBar from "./components/MobileToolBar";
import Layout from "./components/desktopLayout/Layout.jsx";
import { useFormStore } from "./state/formStore";
import { useUIApi } from "./state/uiApi"; 

export default function App() {
  const ui = useUIApi();

  // ────────── Resolve selected field from form store ──────────
  const selectedField = useFormStore(
    React.useCallback(
      (s) => (ui.selectedFieldId.value ? s.byId[ui.selectedFieldId.value] : null),
      [ui.selectedFieldId.value]
    )
  );

  // ────────── Clear active child pair whenever mode/selection changes ──────────
  useEffect(() => {
    ui.selectedChildId.clear();
  }, [ui.selectedFieldId.value, ui.state.isPreview, ui.selectedChildId.clear]);

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
