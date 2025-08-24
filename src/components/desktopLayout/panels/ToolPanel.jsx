import React from "react";
import fieldTypes from "../../../fields/fieldTypes-config"

export default function ToolPanel({ onAdd}) {

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Tools</h3>
      <div className="grid grid-cols-1 gap-2">
        {Object.keys(fieldTypes).map((t) => (
          <button
            key={t}
            className="px-3 py-2 text-left border border-black/10 rounded-md hover:bg-slate-50"
            onClick={() => onAdd(t)}
          >
            Add {fieldTypes[t].label}
          </button>
        ))}
      </div>
    </div>
  );
}
