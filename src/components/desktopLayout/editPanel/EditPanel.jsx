import React from "react";
import NonSectionEditor from "./types/NonSectionEditor";
import SectionEditor from "./types/SectionEditor";
import { useUIStore } from "../../../state/uiStore";
import { useFormStore } from "../../../state/formStore";

export default function EditPanel() {
  const isPreview = useUIStore((s) => s.isPreview);
  const selectedFieldId = useUIStore((s) => s.selectedFieldId);
  const setSectionActiveChild = useUIStore((s) => s.setSectionActiveChild);

  const selectedField = useFormStore(
    React.useCallback((s) => (selectedFieldId ? s.byId[selectedFieldId] : null), [selectedFieldId])
  );

  if (isPreview) return null;

  const isNone = !selectedField;
  const isSection = selectedField?.fieldType === "section";

  return (
    <div
      className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-y-auto custom-scrollbar 
        ${selectedField ? "" : "max-h-32"} max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)]`}
    >
      {/* ────────── Place holder ──────────  */}
      {isNone && (
        <div className="text-gray-600">
          <h3 className="text-lg font-semibold mb-2">Edit</h3>
          <p>Select a field in the center panel to edit its properties.</p>
        </div>
      )}

      {/* ────────── Non Section Editor ──────────  */}
      {!isNone && !isSection &&
        <NonSectionEditor f={selectedField} />}

      {/* ────────── Section Editor ──────────  */}
      {!isNone && isSection && (
        <SectionEditor section={selectedField} onActiveChildChange={setSectionActiveChild} />
      )}
    </div>
  );
}
