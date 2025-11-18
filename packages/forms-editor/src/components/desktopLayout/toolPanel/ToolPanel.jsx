import React, { useMemo } from "react";
import { fieldTypes, useFormStore } from "@mieweb/forms-engine";

const TOOL_ITEMS = Object.entries(fieldTypes).map(([type, cfg]) => ({
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
    <div className="tool-panel-container pb-4 px-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-y-auto custom-scrollbar max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)]">
      <h3 className="tool-panel-title sticky top-0 z-10 bg-white text-lg font-semibold mb-3 pb-2 pt-2 border-b border-gray-200">Tools</h3>
      <div className="tool-panel-items grid grid-cols-1 gap-2">
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
