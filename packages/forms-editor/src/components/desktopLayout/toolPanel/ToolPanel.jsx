import React, { useMemo } from "react";
import { fieldTypes, useFormStore, TEXTINPUT_ICON, FOLDERS_ICON, SELECTINPUT_ICON, RANKING_ICON, MATRIX_ICON, PAPERCLIP_ICON, TOOLS_ICON } from "@mieweb/forms-engine";

const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    case "Text Fields":
      return TEXTINPUT_ICON;
    case "Organization":
      return FOLDERS_ICON;
    case "Selection Fields":
      return SELECTINPUT_ICON;
    case "Rating & Ranking":
      return RANKING_ICON;
    case "Matrix Fields":
      return MATRIX_ICON;
    case "Rich Content":
      return PAPERCLIP_ICON;
    default:
      return null;
  }
};

const ToolPanelImpl = ({ isPreview = false }) => {
  if (isPreview) return null;

  const addField = useFormStore((s) => s.addField);

  const categories = useMemo(() => {
    const result = {};

    Object.entries(fieldTypes)
      .filter(([type]) => type !== "unsupported") 
      .forEach(([type, config]) => {
        const category = config.category || "Other";
        if (!result[category]) result[category] = [];
        result[category].push({
          type,
          label: config.label,
        });
      });

    return result;
  }, []);

  const handlers = useMemo(() => {
    const m = {};
    Object.values(categories).forEach(items => {
      items.forEach(({ type }) => {
        m[type] = () => addField(type);
      });
    });
    return m;
  }, [categories, addField]);

  return (
    <div className="tool-panel-container pb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-y-auto custom-scrollbar max-h-[calc(100svh-24rem)] lg:max-h-[calc(100dvh-20rem)]">
      <h3 className="tool-panel-title sticky top-0 z-20 bg-white text-lg font-semibold pb-2 pt-4 px-4 border-b border-gray-200 flex items-center gap-2">
        <TOOLS_ICON className="w-5 h-5 text-gray-700" />
        Tools
      </h3>
      
      {Object.entries(categories).map(([categoryName, items]) => (
        <div key={categoryName} className="tool-category">
          <h4 className="sticky top-13 z-10 bg-gray-50 text-sm font-semibold text-gray-700 px-4 py-2 border-b border-gray-100 uppercase tracking-wide flex items-center gap-2">
            {(() => {
              const IconComponent = getCategoryIcon(categoryName);
              return IconComponent ? <IconComponent className="w-4 h-4 text-gray-600" /> : null;
            })()}
            {categoryName}
          </h4>
          <div className="tool-items grid grid-cols-1 gap-2 px-4 py-3">
            {items.map(({ type, label }) => (
              <button
                key={type}
                className="px-3 py-2.5 text-sm text-left border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-colors duration-150"
                onClick={handlers[type]}
                title={`Add ${label}`}
              >
                + {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ────────── Memo: only re-render if isPreview changes ────────── */
const ToolPanel = React.memo(ToolPanelImpl, (prev, next) => prev.isPreview === next.isPreview);

export default ToolPanel;
