import React from "react";
import fieldTypes from "../../../fields/fieldTypes-config"
import { addField } from "../../../utils/formActions";

export default function ToolPanel({ formData, setFormData, isPreview }) {
  if (isPreview) return null;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Tools</h3>
      <div className="grid grid-cols-1 gap-2">
        {Object.keys(fieldTypes).map((t) => (
          <button
            key={t}
            className="px-3 py-2 text-left border border-black/10 rounded-md hover:bg-slate-50"
            onClick={() => addField(formData, setFormData, t)}
          >
            Add {fieldTypes[t].label}
          </button>
        ))}
      </div>
    </div>
  );
}
