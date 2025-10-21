import React from "react";
import { generateOptionId } from "@mieweb/forms-engine";

export default function OptionListEditor({ field, onUpdateField }) {
  const opts = field.options || [];

  const addOption = () => {
    const existingIds = new Set(opts.map(o => o.id));
    const newId = generateOptionId("", existingIds, field.id);
    onUpdateField("options", [...opts, { id: newId, value: "" }]);
  };

  const updateOption = (id, value) => {
    onUpdateField(
      "options",
      opts.map((o) => (o.id === id ? { ...o, value } : o))
    );
  };

  const removeOption = (id) => {
    onUpdateField(
      "options",
      opts.filter((o) => o.id !== id)
    );
  };

  return (
    <div className="mt-3">
      <div className="text-sm font-medium mb-1">Options</div>
      {opts.map((opt) => (
        <div key={opt.id} className="flex items-center gap-2 mb-2">
          <input
            className="flex-1 px-3 py-2 border border-black/20 rounded"
            value={opt.value}
            onChange={(e) => updateOption(opt.id, e.target.value)}
            placeholder="Option text"
          />
          <button
            onClick={() => removeOption(opt.id)}
            className="px-2 py-1 text-sm border border-black/20 rounded hover:bg-slate-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addOption}
        className="mt-1 px-3 py-2 text-sm border border-black/20 rounded hover:bg-slate-50"
      >
        + Add Option
      </button>
    </div>
  );
}
