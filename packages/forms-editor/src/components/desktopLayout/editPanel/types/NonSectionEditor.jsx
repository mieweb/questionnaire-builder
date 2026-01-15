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
      <CommonEditor f={f} onUpdateField={onUpdateField} />

      {f.fieldType === "input" && (
        <div className="non-section-editor-default-answer mie:mt-4">
          <div className="mie:text-sm mie:font-medium mie:mb-1">Default Answer</div>
          <input
            className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-black/20 mie:rounded"
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
