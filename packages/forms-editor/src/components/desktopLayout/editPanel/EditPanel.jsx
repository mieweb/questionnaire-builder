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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- .set is stable
    [ui.selectedChildId.set]
  );

  React.useEffect(() => {
    ui.selectedChildId.set(null, null);
    setTab("EDIT");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset on field selection change
  }, [ui.selectedFieldId.value]);

  if (ui.state.isPreview) return null;

  const isNone = !selectedField;
  const isSection = selectedField?.fieldType === "section";

  return (
    <div
      className={`edit-panel-container mie:bg-miesurface mie:border mie:border-mieborder mie:rounded-lg mie:shadow-sm ${
        isMobileModal
          ? "mie:overflow-visible mie:max-h-none"
          : "mie:overflow-y-auto mie:custom-scrollbar mie:max-h-[calc(100svh-24rem)] mie:lg:max-h-[calc(100dvh-20rem)]"
      }`}
    >
      {/* Sticky Header with Mode Toggle */}
      <div className="mie:sticky mie:top-0 mie:z-20 mie:bg-miesurface mie:border-b mie:border-mieborder mie:px-4 mie:pt-3 mie:pb-2">
        {/* Mode Toggle */}
        <div className="mie:flex mie:gap-1 mie:rounded-lg mie:border mie:border-mieborder mie:bg-miebackground mie:p-1 mie:w-full">
          <button
            type="button"
            onClick={() => setTab("EDIT")}
            className={`mie:flex-1 mie:flex mie:items-center mie:justify-center mie:gap-2 mie:px-3 mie:py-2 mie:rounded-lg mie:text-xs mie:font-medium mie:transition-colors mie:border-0 mie:outline-none mie:focus:outline-none ${
              tab === "EDIT"
                ? "mie:bg-mieprimary mie:text-mietextsecondary mie:shadow-sm"
                : "mie:bg-transparent mie:text-mietextmuted mie:hover:text-mietext mie:hover:bg-miesurface"
            }`}
          >
            <EDIT_ICON className="mie:w-4 mie:h-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("LOGIC")}
            className={`mie:flex-1 mie:flex mie:items-center mie:justify-center mie:gap-2 mie:px-3 mie:py-2 mie:rounded-lg mie:text-xs mie:font-medium mie:transition-colors mie:border-0 mie:outline-none mie:focus:outline-none ${
              tab === "LOGIC"
                ? "mie:bg-mieprimary mie:text-mietextsecondary mie:shadow-sm"
                : "mie:bg-transparent mie:text-mietextmuted mie:hover:text-mietext mie:hover:bg-miesurface"
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
          <div className="edit-panel-empty mie:text-mietextmuted">
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
