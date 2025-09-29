// Complete Form Editor Application
import React, { useEffect } from "react";
import Header from "./components/Header.jsx";
import MobileToolBar from "./components/MobileToolBar.jsx";
import EditorLayout from "./components/Layout.jsx";
import { FormPreview } from "@questionnaire-builder/forms";
import { useFormStore, useUIApi, useFormApi, useFieldsArray } from "./state/index.js";
import { isVisible } from "./utils/visibilityChecker.js";

/**
 * Complete Form Editor Application
 * This is the main application that provides a full-featured form builder interface
 * including editor tools, preview mode, and state management.
 */
export default function FormEditor() {
  // Create hooks object to pass down to all components
  const hooks = {
    useFormStore,
    useUIApi,
    useFormApi,
    useFieldsArray
  };

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
      <Header hooks={hooks} />
      
      {/* Mobile toolbar */}
      <div className="lg:hidden">
        <MobileToolBar hooks={hooks} />
      </div>

      {/* Main content area */}
      {ui.state.isPreview ? (
        <div className="w-full max-w-6xl mx-auto px-4 h-fit rounded-lg mt-2">
          <FormPreview hooks={hooks} isVisible={isVisible} />
        </div>
      ) : (
        <EditorLayout hooks={hooks} selectedField={selectedField} />
      )}
    </div>
  );
}