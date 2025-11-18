import React from "react";
import NonSectionEditor from "./types/NonSectionEditor";
import SectionEditor from "./types/SectionEditor";
import LogicEditor from "./types/LogicEditor";
import { useUIApi, useFormStore } from "@mieweb/forms-engine";

export default function EditPanel() {
  const ui = useUIApi();

  const selectedField = useFormStore(
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
      className="edit-panel-container p-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-y-auto custom-scrollbar max-h-[calc(100svh-24rem)] lg:max-h-[calc(100dvh-20rem)]"
    >
      <div
        className="edit-panel-tabs inline-flex rounded-md border border-gray-200 overflow-hidden bg-white mb-4"
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

      {isNone && (
        <div className="edit-panel-empty text-gray-600">
          <p>Select a field in the center panel to edit its properties.</p>
        </div>
      )}

      {!isNone && tab === "EDIT" && (
        <>
          {!isSection && <NonSectionEditor f={selectedField} />}
          {isSection && (
            <SectionEditor
              section={selectedField}
              onActiveChildChange={handleActiveChildChange}
            />
          )}
        </>
      )}

      {/* ────────── Edit Tab ────────── */}
            
      {!isNone && tab === "LOGIC" && <LogicEditor />}
    </div>
  );
}
