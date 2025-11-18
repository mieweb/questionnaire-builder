import React from "react";
import CommonEditor from "./CommonEditor";
import OptionListEditor from "./OptionListEditor";
import MatrixEditor from "./MatrixEditor";
import { useFormApi, fieldTypes } from "@mieweb/forms-engine";

function NonSectionEditor({ f }) {
  const api = useFormApi(f.id);

  const onUpdateField = React.useCallback(
    (key, value) => api.field.update(key, value),
    [api]
  );

  const fieldConfig = fieldTypes[f.fieldType] || {};
  const hasOptions = fieldConfig.hasOptions || false;
  const hasMatrix = fieldConfig.hasMatrix || false;

  return (
    <>
      <h3 className="text-lg font-semibold mb-3">Edit</h3>
      <CommonEditor f={f} onUpdateField={onUpdateField} />

      {f.fieldType === "input" && (
        <div className="non-section-editor-default-answer mt-4">
          <div className="text-sm font-medium mb-1">Default Answer</div>
          <input
            className="w-full px-3 py-2 border border-black/20 rounded"
            value={f.answer || ""}
            onChange={(e) => onUpdateField("answer", e.target.value)}
            placeholder="Default value"
          />
        </div>
      )}

      {hasOptions && <OptionListEditor field={f} api={api} />}

      {hasMatrix && <MatrixEditor field={f} api={api} />}
    </>
  );
}

export default NonSectionEditor;
