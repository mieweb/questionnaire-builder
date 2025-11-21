import React from "react";

export default function OptionListEditor({ field, api }) {
  const opts = field.options || [];
  const isBoolean = field.fieldType === "boolean";
  const isMultitext = field.fieldType === "multitext";

  const label = isMultitext ? "Text Inputs" : "Options";
  const singular = isMultitext ? "Text Input" : "Option";
  const placeholder = isMultitext ? "Input label" : "Option text";

  return (
    <div className="mt-3">
      <div className="text-sm font-medium mb-1">{label}</div>
      {opts.map((opt) => (
        <div key={opt.id} className="option-list-editor-item flex items-center gap-2 mb-2">
          <input
            className="flex-1 min-w-0 px-3 py-2 border border-black/20 rounded"
            value={opt.value}
            onChange={(e) => api.option.update(opt.id, e.target.value)}
            placeholder={placeholder}
          />
          {!isBoolean && (
            <button
              onClick={() => api.option.remove(opt.id)}
              className="px-2 py-1 text-sm border border-black/20 rounded hover:bg-slate-50"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      {!isBoolean && (
        <button
          onClick={() => api.option.add("")}
          className="mt-1 px-3 py-2 text-sm border border-black/20 rounded hover:bg-slate-50"
        >
          + Add {singular}
        </button>
      )}
    </div>
  );
}
