import React, { useMemo, useCallback } from "react";
import { fieldTypes, useFormStore, useUIApi, TEXTINPUT_ICON, FOLDERS_ICON, SELECTINPUT_ICON, RANKING_ICON, MATRIX_ICON, PAPERCLIP_ICON, TOOLS_ICON, X_ICON } from "@mieweb/forms-engine";

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
  const ui = useUIApi();
  
  // Get the selected field (same as EditPanel)
  const selectedField = useFormStore(
    useCallback(
      (s) => (ui.selectedFieldId.value ? s.byId[ui.selectedFieldId.value] : null),
      [ui.selectedFieldId.value]
    )
  );

  const isSectionSelected = selectedField?.fieldType === "section";
  const sectionTitle = selectedField?.title || "Section";
  
  const [isHovering, setIsHovering] = React.useState(false);
  
  const handleClearSelection = React.useCallback(() => {
    ui.selectedFieldId.set(null);
  }, [ui.selectedFieldId]);

  // Handle Escape key to clear any selection
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleClearSelection();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClearSelection]);

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
        m[type] = () => {
          if (isSectionSelected && selectedField?.id) {
            // Add to section by passing sectionId in options
            addField(type, { sectionId: selectedField.id });
          } else {
            addField(type);
          }
        };
      });
    });
    return m;
  }, [categories, addField, isSectionSelected, selectedField?.id]);

  return (
    <div 
    
      className=" border border-gray-200 rounded-lg  bg-white overflow-y-auto custom-scrollbar max-h-[calc(100svh-24rem)] lg:max-h-[calc(100dvh-20rem)]"
      tabIndex="-1"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="tool-panel-container pb-4 rounded-lg shadow-sm">
      <h3 className="tool-panel-title sticky top-0 z-20 bg-white text-base font-semibold pb-2 pt-3 px-4 border-b border-gray-200 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 min-w-0">
          <TOOLS_ICON className="w-5 h-5 text-gray-700 flex-shrink-0" />
          <span className="truncate">{isSectionSelected ? `Add to "${sectionTitle}"` : "Tools"}</span>
        </span>
        {isSectionSelected && (
          <button
            onClick={handleClearSelection}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
            title="Unselect section"
          >
            <X_ICON className="w-5 h-5" />
          </button>
        )}
      </h3>
      
      {Object.entries(categories).map(([categoryName, items]) => (
        <div key={categoryName} className="tool-category">
          <h4 className="sticky top-11 z-10 bg-gray-50 text-sm font-semibold text-gray-700 px-4 py-3 border-b border-gray-100 uppercase tracking-wide flex items-center gap-2">
            {(() => {
              const IconComponent = getCategoryIcon(categoryName);
              return IconComponent ? <IconComponent className="w-4 h-4 text-gray-600" /> : null;
            })()}
            {categoryName}
          </h4>
          <div className="tool-items grid grid-cols-1 gap-2 px-4 py-3">
            {items.map(({ type, label }) => {
              // Disable section field when adding to a section
              const isDisabled = isSectionSelected && type === "section";
              return (
                <button
                  key={type}
                  disabled={isDisabled}
                  className={`px-3 py-2 text-sm text-left border rounded-md transition-colors duration-150 ${
                    isDisabled
                      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700"
                  }`}
                  onClick={handlers[type]}
                  title={isDisabled ? "Cannot add section to a section" : `Add ${label}`}
                >
                  + {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

/* ────────── Memo: only re-render if isPreview changes ────────── */
const ToolPanel = React.memo(ToolPanelImpl, (prev, next) => prev.isPreview === next.isPreview);

export default ToolPanel;
