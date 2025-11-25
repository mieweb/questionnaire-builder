import React from "react";
import NonSectionEditor from "./types/NonSectionEditor";
import SectionEditor from "./types/SectionEditor";
import LogicEditor from "./types/LogicEditor";
import { useUIApi, useFormStore, EDIT_ICON, EYEEDIT_ICON } from "@mieweb/forms-engine";

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
      className="edit-panel-container bg-white border border-gray-200 rounded-lg shadow-sm overflow-y-auto custom-scrollbar max-h-[calc(100svh-24rem)] lg:max-h-[calc(100dvh-20rem)]"
    >
      {/* Sticky Header with Mode Toggle */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 pt-3 pb-2">
        {/* Mode Toggle */}
        <div className="flex gap-1 rounded-lg border border-black/10 bg-black/5 p-1 w-full">
          <button
            type="button"
            onClick={() => setTab("EDIT")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              tab === "EDIT"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <EDIT_ICON className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("LOGIC")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              tab === "LOGIC"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <EYEEDIT_ICON className="w-4 h-4" />
            <span>Logic</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
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
                  
        {!isNone && tab === "LOGIC" && <LogicEditor />}
      </div>
    </div>
  );
}
