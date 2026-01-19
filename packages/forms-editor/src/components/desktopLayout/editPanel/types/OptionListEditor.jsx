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
    <div className="mie:space-y-3">
      <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext">{label}</label>
      <div ref={containerRef} className="mie:space-y-2">
        {opts.map((opt) => (
          <div key={opt.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:rounded-lg mie:shadow-sm mie:hover:border-mieprimary/50 mie:transition-colors">
            <input
              className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent"
              value={opt.value}
              onChange={(e) => api.option.update(opt.id, e.target.value)}
              placeholder={placeholder}
            />
            {!isBoolean && (
              <button
                onClick={() => api.option.remove(opt.id)}
                className="mie:shrink-0 mie:bg-transparent mie:text-mietextmuted/70 mie:hover:text-miedanger mie:transition-colors"
                title="Remove option"
              >
                <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
      {!isBoolean && (
        <button
          onClick={() => api.option.add("")}
          className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:bg-miesurface mie:text-mieprimary mie:border mie:border-mieprimary/50 mie:rounded-lg mie:hover:bg-mieprimary/10 mie:transition-colors"
        >
          + Add {singular}
        </button>
      )}
    </div>
  );
}
