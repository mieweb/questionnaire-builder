import React from "react";
import NonSectionEditor from "./types/NonSectionEditor";
import SectionEditor from "./types/SectionEditor";
import LogicEditor from "./types/LogicEditor";
import { useUIApi } from "../../../state/uiApi";
import { useFormStore } from "../../../state/formStore";

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

  if (ui.state.isPreview) return null;

  const isNone = !selectedField;
  const isSection = selectedField?.fieldType === "section";

  return (
    <div
      className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-y-auto custom-scrollbar 
        ${selectedField ? "" : "max-h-32"} max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)]`}
    >
      {/* ────────── Place holder ────────── */}
      {isNone && (
        <div className="text-gray-600">
          <h3 className="text-lg font-semibold mb-2">Edit</h3>
          <p>Select a field in the center panel to edit its properties.</p>
        </div>
      )}

      {/* ────────── Tabs ────────── */}
      {!isNone && (
        <div className="mb-4">
          <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
            <button
              onClick={() => setTab("EDIT")}
              className={`px-3 py-1 text-sm ${tab === "EDIT" ? "bg-gray-100 font-semibold" : "bg-white"}`}
            >
              EDIT
            </button>
            <button
              onClick={() => setTab("LOGIC")}
              className={`px-3 py-1 text-sm border-l border-gray-200 ${tab === "LOGIC" ? "bg-gray-100 font-semibold" : "bg-white"}`}
            >
              LOGIC
            </button>
          </div>
        </div>
      )}

      {/* ────────── EDIT Tab ────────── */}
      {!isNone && tab === "EDIT" && (
        <>
          {!isSection && <NonSectionEditor f={selectedField} />}
          {isSection && (
            <SectionEditor
              section={selectedField}
              // ────────── Stable callback ──────────
              onActiveChildChange={handleActiveChildChange}
            />
          )}
        </>
      )}

      {/* ────────── LOGIC Tab ────────── */}
      {!isNone && tab === "LOGIC" && <LogicEditor />}
    </div>
  );
}
