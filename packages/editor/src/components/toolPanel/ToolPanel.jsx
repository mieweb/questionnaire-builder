import React, { useMemo } from "react";
import { fieldTypes } from "@questionnaire-builder/fields";

const TOOL_ITEMS = Object.entries(fieldTypes).map(([type, cfg]) => ({
  type,
  label: cfg.label,
  icon: cfg.icon,
}));

const ToolPanelImpl = ({ hooks, isPreview }) => {
  if (isPreview) return null;

  const addField = hooks.useFormStore((s) => s.addField);

  const handlers = useMemo(() => {
    const m = {};
    for (const { type } of TOOL_ITEMS) m[type] = () => addField(type);
    return m;
  }, [addField]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Tools</h3>
      <div className="grid grid-cols-1 gap-2">
        {TOOL_ITEMS.map(({ type, label, icon }) => (
          <button
            key={type}
            className="px-3 py-2 text-left border border-black/10 rounded-md hover:bg-slate-50 flex items-center gap-2"
            onClick={handlers[type]}
          >
            {icon && <span className="text-lg">{icon}</span>}
            <span>Add {label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ────────── Memo: only re-render if isPreview changes ────────── */
const ToolPanel = React.memo(ToolPanelImpl, (prev, next) => prev.isPreview === next.isPreview && prev.hooks === next.hooks);

export default ToolPanel;
