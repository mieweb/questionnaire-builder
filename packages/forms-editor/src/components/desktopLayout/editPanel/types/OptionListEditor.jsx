import React from "react";
import { TRASHCANTWO_ICON } from "@mieweb/forms-engine";

export default function OptionListEditor({ field, api }) {
  const opts = field.options || [];
  const isBoolean = field.fieldType === "boolean";
  const isMultitext = field.fieldType === "multitext";
  const containerRef = React.useRef(null);
  const prevCountRef = React.useRef(opts.length);

  const label = isMultitext ? "Text Inputs" : "Options";
  const singular = isMultitext ? "Text Input" : "Option";
  const placeholder = isMultitext ? "Input label" : "Option text";

  // Auto-scroll when new option is added
  React.useEffect(() => {
    if (opts.length > prevCountRef.current && containerRef.current) {
      const lastChild = containerRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
    prevCountRef.current = opts.length;
  }, [opts.length]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div ref={containerRef} className="space-y-2">
        {opts.map((opt) => (
          <div key={opt.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
            <input
              className="flex-1 min-w-0 outline-none bg-transparent"
              value={opt.value}
              onChange={(e) => api.option.update(opt.id, e.target.value)}
              placeholder={placeholder}
            />
            {!isBoolean && (
              <button
                onClick={() => api.option.remove(opt.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove option"
              >
                <TRASHCANTWO_ICON className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
      {!isBoolean && (
        <button
          onClick={() => api.option.add("")}
          className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          + Add {singular}
        </button>
      )}
    </div>
  );
}
