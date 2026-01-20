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
      className=" mie:border mie:border-mieborder mie:rounded-lg mie:bg-miesurface mie:overflow-y-auto mie:custom-scrollbar mie:max-h-[calc(100svh-24rem)] mie:lg:max-h-[calc(100dvh-20rem)]"
      tabIndex="-1"
    >
      <div className="tool-panel-container mie:pb-4 mie:rounded-lg mie:shadow-sm">
      <h3 className="tool-panel-title mie:sticky mie:top-0 mie:z-20 mie:bg-miesurface mie:text-base mie:font-semibold mie:text-mietext mie:pb-2 mie:pt-3 mie:px-4 mie:border-b mie:border-mieborder mie:flex mie:items-center mie:justify-between mie:gap-2">
        <span className="mie:flex mie:items-center mie:gap-2 mie:min-w-0">
          <TOOLS_ICON className="mie:w-5 mie:h-5 mie:text-mietext mie:shrink-0" />
          <span className="mie:truncate mie:text-mietext">{isSectionSelected ? `Add to "${sectionTitle}"` : "Tools"}</span>
        </span>
        {isSectionSelected && (
          <button
            onClick={handleClearSelection}
            className="mie:bg-transparent mie:text-mietextmuted mie:hover:text-miedanger mie:hover:bg-miedanger/10 mie:p-1 mie:rounded mie:transition-colors mie:shrink-0"
            title="Unselect section"
          >
            <X_ICON className="mie:w-5 mie:h-5" />
          </button>
        )}
      </h3>
      
      {Object.entries(categories).map(([categoryName, items]) => (
        <div key={categoryName} className="tool-category">
          <h4 className="mie:sticky mie:top-11 mie:z-10 mie:bg-miebackground mie:text-sm mie:font-semibold mie:text-mietext mie:px-4 mie:py-3 mie:border-b mie:border-mieborder mie:uppercase mie:tracking-wide mie:flex mie:items-center mie:gap-2">
            {(() => {
              const IconComponent = getCategoryIcon(categoryName);
              return IconComponent ? <IconComponent className="mie:w-4 mie:h-4 mie:text-mietextmuted" /> : null;
            })()}
            {categoryName}
          </h4>
          <div className="tool-items mie:grid mie:grid-cols-1 mie:gap-2 mie:px-4 mie:py-3">
            {items.map(({ type, label }) => {
              // Disable section field when adding to a section
              const isDisabled = isSectionSelected && type === "section";
              return (
                <button
                  key={type}
                  disabled={isDisabled}
                  className={`mie:px-3 mie:py-2 mie:text-sm mie:text-left mie:border mie:rounded-md mie:transition-colors mie:duration-150 ${
                    isDisabled
                      ? "mie:border-mieborder mie:bg-miebackground mie:text-mietextmuted/50 mie:cursor-not-allowed"
                      : "mie:bg-miesurface mie:text-mietext mie:border-mieborder mie:hover:bg-mieprimary/10 mie:hover:border-mieprimary/50 mie:hover:text-mieprimary"
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
