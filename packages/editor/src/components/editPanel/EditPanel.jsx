import React from "react";
import NonSectionEditor from "./types/NonSectionEditor.jsx";
import SectionEditor from "./types/SectionEditor.jsx";
import LogicEditor from "./types/LogicEditor.jsx";

export default function EditPanel({ hooks }) {
  const ui = hooks.useUIApi();

  const selectedField = hooks.useFormStore(
    React.useCallback(
      (s) => (ui.selectedFieldId.value ? s.byId[ui.selectedFieldId.value] : null),
      [ui.selectedFieldId.value]
    )
  );

  const [tab, setTab] = React.useState("EDIT");

  const handleActiveChildChange = React.useCallback(
    (sectionId, childId) => {
      ui.selectedChildId.set(sectionId, childId);
    },
    [ui.selectedChildId.set]
  );

  React.useEffect(() => {
    ui.selectedChildId.set(null, null);
    setTab("EDIT");
  }, [ui.selectedFieldId.value]);

  if (ui.state.isPreview) return null;

  const isNone = !selectedField;
  const isSection = selectedField?.fieldType === "section";

  return (
    <div
      className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-y-auto custom-scrollbar 
        ${selectedField ? "" : "max-h-32"} max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)]`}
    >
      {/* Tabs always visible (sticky so they stay on top like the X button) */}
      <div
        className="sticky top-0 z-30 mb-4 inline-flex rounded-md border border-gray-200 overflow-hidden bg-white"
        role="tablist"
      >
        <button type="button" onClick={() => setTab("EDIT")} aria-selected={tab === "EDIT"}
          className={`px-3 py-1 text-sm ${tab === "EDIT" ? "bg-gray-100 font-semibold" : "bg-white"}`}>
          EDIT
        </button>
        <button type="button" onClick={() => setTab("LOGIC")} aria-selected={tab === "LOGIC"}
          className={`px-3 py-1 text-sm border-l border-gray-200 ${tab === "LOGIC" ? "bg-gray-100 font-semibold" : "bg-white"}`}>
          LOGIC
        </button>
      </div>

      {/* ────────── Place holder ────────── */}
      {isNone && (
        <div className="text-gray-600">
          <h3 className="text-lg font-semibold mb-2">Edit</h3>
          <p>Select a field in the center panel to edit its properties.</p>
        </div>
      )}

      {/* ────────── Edit Tab ────────── */}
      {!isNone && tab === "EDIT" && (
        <>
          {!isSection && <NonSectionEditor f={selectedField} hooks={hooks} />}
          {isSection && (
            <SectionEditor
              section={selectedField}
              onActiveChildChange={handleActiveChildChange}
              hooks={hooks}
            />
          )}
        </>
      )}
      
      {/* ────────── Edit Tab ────────── */}
      {!isNone && tab === "LOGIC" && <LogicEditor hooks={hooks} />}
    </div>
  );
}
