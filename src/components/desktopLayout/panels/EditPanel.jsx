import React from "react";
import OptionListEditor from "./OptionListEditor";
import { updateField } from "../../../utils/formActions";

export default function EditPanel({ selectedField, formData, setFormData, isPreview }) {
  
  // Do not render at all in preview mode
  if (isPreview) return null;

  // If nothing selected, show a friendly placeholder
  if (!selectedField) {
    return (
      <div className="p-4 text-gray-600">
        <h3 className="text-lg font-semibold mb-2">Edit</h3>
        <p>Select a field in the center panel to edit its properties.</p>
      </div>
    );
  }

  const f = selectedField;
  const onUpdateField = (key, value) => updateField(formData, setFormData, f.id, key, value);
  const isChoice = ["radio", "check", "selection"].includes(f.fieldType);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Edit</h3>

      {/* Common */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">ID</label>
          <input
            className="w-full px-3 py-2 border border-black/20 rounded"
            value={f.id}
            onChange={(e) => onUpdateField("id", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Label / Question</label>
          <input
            className="w-full px-3 py-2 border border-black/20 rounded"
            value={f.question || ""}
            onChange={(e) => onUpdateField("question", e.target.value)}
            placeholder="Enter question text"
          />
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!f.required}
              onChange={(e) => onUpdateField("required", e.target.checked)}
            />
            Required
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">Sublabel (optional)</label>
          <textarea
            className="w-full px-3 py-2 border border-black/20 rounded"
            value={f.sublabel || ""}
            onChange={(e) => onUpdateField("sublabel", e.target.value)}
            placeholder="Helper text / description"
          />
        </div>
      </div>

      {/* Type-specific */}
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

      {isChoice && <OptionListEditor field={f} onUpdate={onUpdateField} />}
    </div>
  );
}
