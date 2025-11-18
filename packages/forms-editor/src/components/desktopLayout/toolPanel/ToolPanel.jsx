import React, { useMemo } from "react";
import { fieldTypes, useFormStore } from "@mieweb/forms-engine";

const TOOL_ITEMS = Object.entries(fieldTypes)
  .filter(([type]) => type !== "unsupported")
  .map(([type, cfg]) => ({
    type,
    label: cfg.label,
  }));

const ToolPanelImpl = ({ isPreview = false }) => {
  if (isPreview) return null;

  const addField = useFormStore((s) => s.addField);

  const handlers = useMemo(() => {
    const m = {};
    for (const { type } of TOOL_ITEMS) m[type] = () => addField(type);
    return m;
  }, [addField]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Tools</h3>
      <div className="grid grid-cols-1 gap-2">
        {TOOL_ITEMS.map(({ type, label }) => (
          <button
            key={type}
            className="px-3 py-2 text-left border border-black/10 rounded-md hover:bg-slate-50"
            onClick={handlers[type]}
          >
            Add {label}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ────────── Memo: only re-render if isPreview changes ────────── */
const ToolPanel = React.memo(ToolPanelImpl, (prev, next) => prev.isPreview === next.isPreview);

export default ToolPanel;
