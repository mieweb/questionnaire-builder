import React from "react";
import CommonEditor from "./CommonEditor";
import OptionListEditor from "./OptionListEditor";
import MatrixEditor from "./MatrixEditor";
import { useFormApi, fieldTypes, useInstanceId } from "@mieweb/forms-engine";

function NonSectionEditor({ f }) {
  const instanceId = useInstanceId();
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
          <label htmlFor={`${instanceId}-editor-default-answer-${f.id}`} className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">Default Answer</label>
          <input
            id={`${instanceId}-editor-default-answer-${f.id}`}
            aria-label="Default Answer"
            className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
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
