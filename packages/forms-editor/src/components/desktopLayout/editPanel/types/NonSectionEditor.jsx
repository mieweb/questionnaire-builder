import React, { useCallback, useMemo } from "react";
import CommonEditor from "./CommonEditor";
import OptionListEditor from "./OptionListEditor";
import { useFormApi } from "@mieweb/forms-engine";

function NonSectionEditor({ f }) {
  const api = useFormApi(f.id);

  {/* ────────── update top-level field props ──────────  */}
  const onUpdateField = useCallback(
    (key, value) => api.field.update(key, value),
    [api]
  );

  const isChoice = useMemo(
    () => ["radio", "check", "selection"].includes(f.fieldType),
    [f.fieldType]
  );

  return (
    <>
      <h3 className="text-lg font-semibold mb-3">Edit</h3>
      <CommonEditor f={f} onUpdateField={onUpdateField} />

      {f.fieldType === "input" && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-1">Default Answer</div>
          <input
            className="w-full px-3 py-2 border border-black/20 rounded"
            value={f.answer || ""}
            onChange={(e) => onUpdateField("answer", e.target.value)}
            placeholder="Default value"
          />
        </div>
      )}

      {isChoice && <OptionListEditor field={f} onUpdateField={onUpdateField} />}
    </>
  );
}

export default NonSectionEditor;
