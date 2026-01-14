import React from "react";
import NonSectionEditor from "./types/NonSectionEditor";
import SectionEditor from "./types/SectionEditor";
import LogicEditor from "./types/LogicEditor";
import { useUIApi, useFormStore, EDIT_ICON, EYEEDIT_ICON } from "@mieweb/forms-engine";

export default function EditPanel({ isMobileModal = false }) {
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
      className={`edit-panel-container mie:bg-white mie:border mie:border-gray-200 mie:rounded-lg mie:shadow-sm ${
        isMobileModal
          ? "mie:overflow-visible mie:max-h-none"
          : "mie:overflow-y-auto mie:custom-scrollbar mie:max-h-[calc(100svh-24rem)] mie:lg:max-h-[calc(100dvh-20rem)]"
      }`}
    >
      {/* Sticky Header with Mode Toggle */}
      <div className="mie:sticky mie:top-0 mie:z-20 mie:bg-white mie:border-b mie:border-gray-200 mie:px-4 mie:pt-3 mie:pb-2">
        {/* Mode Toggle */}
        <div className="mie:flex mie:gap-1 mie:rounded-lg mie:border mie:border-black/10 mie:bg-black/5 mie:p-1 mie:w-full">
          <button
            type="button"
            onClick={() => setTab("EDIT")}
            className={`mie:flex-1 mie:flex mie:items-center mie:justify-center mie:gap-2 mie:px-3 mie:py-2 mie:rounded-lg mie:text-xs mie:font-medium mie:transition-colors ${
              tab === "EDIT"
                ? "mie:bg-white mie:text-slate-900 mie:shadow-sm"
                : "mie:text-slate-600 mie:hover:text-slate-900"
            }`}
          >
            <EDIT_ICON className="mie:w-4 mie:h-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("LOGIC")}
            className={`mie:flex-1 mie:flex mie:items-center mie:justify-center mie:gap-2 mie:px-3 mie:py-2 mie:rounded-lg mie:text-xs mie:font-medium mie:transition-colors ${
              tab === "LOGIC"
                ? "mie:bg-white mie:text-slate-900 mie:shadow-sm"
                : "mie:text-slate-600 mie:hover:text-slate-900"
            }`}
          >
            <EYEEDIT_ICON className="mie:w-4 mie:h-4" />
            <span>Logic</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="mie:p-4">
        {isNone && (
          <div className="edit-panel-empty mie:text-gray-600">
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
