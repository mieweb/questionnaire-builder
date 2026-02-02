import React from "react";
import { useFormStore, CustomCheckbox, useInstanceId } from "@mieweb/forms-engine";
import DraftIdEditor from "./DraftIdEditor"
import InputTypeEditor from "./InputTypeEditor";

function CommonEditor({ f, onUpdateField }) {
  const instanceId = useInstanceId();
  const byId = useFormStore(React.useCallback(s => s.byId, []));

  const validateId = React.useCallback((newId, oldId) => {
    // Empty ID check
    if (!newId?.trim()) return "ID cannot be empty.";
    
    // Unchanged ID is OK
    if (newId === oldId) return "";
    
    // Collect all existing IDs (root + children of all sections)
    const allIds = new Set(Object.keys(byId));
    Object.values(byId).forEach((field) => {
      if (field?.fieldType === "section" && Array.isArray(field.fields)) {
        field.fields.forEach((child) => allIds.add(child.id));
      }
    });
    
    // Check for collision
    if (allIds.has(newId)) {
      return `ID "${newId}" already exists.`;
    }
    
    return "";
  }, [byId]);

  return (
    <div className="common-editor-container mie:space-y-3">
      <DraftIdEditor
        id={f.id ?? ""}
        validate={validateId}
        onCommit={(next) => onUpdateField?.("id", next)}
      />

      <div>
        <label htmlFor={`${instanceId}-editor-question-${f.id}`} className="mie:block mie:text-sm mie:text-mietext mie:mb-1">Label / Question</label>
        <input
          id={`${instanceId}-editor-question-${f.id}`}
          aria-label="Label / Question"
          className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
          value={f.question || ""}
          onChange={(e) => onUpdateField?.("question", e.target.value)}
          placeholder="Enter question text"
        />
      </div>

      {(f.fieldType === "text" || f.fieldType === "longtext") && (
        <InputTypeEditor field={f} onUpdate={onUpdateField} />
      )}

      <div className="mie:min-w-0">
        <label htmlFor={`${instanceId}-editor-sublabel-${f.id}`} className="mie:block mie:text-sm mie:text-mietext mie:mb-1">Sublabel (optional)</label>
        <textarea
          id={`${instanceId}-editor-sublabel-${f.id}`}
          aria-label="Sublabel (optional)"
          className="mie:w-full mie:min-w-0 mie:max-h-32 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded mie:resize-y mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
          value={f.sublabel || ""}
          onChange={(e) => onUpdateField("sublabel", e.target.value)}
          placeholder="Helper text / description"
        />
      </div>

      <div className="required-checkbox-group mie:inline-flex mie:items-center mie:gap-2 mie:text-sm mie:text-mietext">
        <CustomCheckbox
          id={`${instanceId}-editor-required-${f.id}`}
          checked={!!f.required}
          onChange={(checked) => onUpdateField?.("required", checked)}
          size="md"
        />
        <label htmlFor={`${instanceId}-editor-required-${f.id}`} className="mie:cursor-pointer">Required</label>
      </div>
    </div>
  );
}

export default CommonEditor;
