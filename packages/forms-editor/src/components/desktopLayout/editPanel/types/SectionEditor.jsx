import React from "react";
import OptionListEditor from "./OptionListEditor";
import MatrixEditor from "./MatrixEditor";
import CommonEditor from "./CommonEditor";
import { fieldTypes, FormStoreContext, useFormApi, useUIApi, TRASHCANTWO_ICON, ARROWDOWN_ICON } from "@mieweb/forms-engine";
import DraftIdEditor from "./DraftIdEditor"

function SectionEditor({ section, onActiveChildChange }) {
  const sectionApi = useFormApi(section.id);
  const formStore = React.useContext(FormStoreContext);
  const ui = useUIApi();

  if (!formStore) throw new Error('Missing FormStoreContext.Provider in the tree');

  const children = Array.isArray(section.fields) ? section.fields : [];
  
  // Initialize from global selectedChildId if valid for this section, otherwise first child
  const globalParentId = ui.selectedChildId.ParentId;
  const globalChildId = ui.selectedChildId.ChildId;
  const initialChildId = React.useMemo(() => {
    if (globalParentId === section.id && globalChildId && children.some((c) => c.id === globalChildId)) {
      return globalChildId;
    }
    return children[0]?.id || null;
  }, []); // Only compute once on mount
  
  const [activeChildId, setActiveChildId] = React.useState(initialChildId);

  // Sync with global selectedChildId from section (only when global changes externally)
  const prevGlobalChildIdRef = React.useRef(globalChildId);
  React.useEffect(() => {
    // Only sync if global changed AND it's for this section AND different from current
    if (prevGlobalChildIdRef.current !== globalChildId) {
      prevGlobalChildIdRef.current = globalChildId;
      if (globalParentId === section.id && globalChildId && globalChildId !== activeChildId) {
        setActiveChildId(globalChildId);
      }
    }
  }, [globalParentId, globalChildId, section.id, activeChildId]);

  React.useEffect(() => {
    if (!children.length) {
      if (activeChildId !== null) setActiveChildId(null);
      return;
    }
    const stillExists = children.some((c) => c.id === activeChildId);
    if (!stillExists) setActiveChildId(children[0].id);
  }, [children, activeChildId]);

  React.useEffect(() => {
    onActiveChildChange?.(section.id, activeChildId || null);
  }, [section.id, activeChildId, onActiveChildChange]);

  const handleChildSelect = React.useCallback(
    (childId) => {
      setActiveChildId(childId);
      // Also update the global UI state for highlighting in the section
      ui.selectedChildId.set(section.id, childId);
    },
    [section.id, ui.selectedChildId]
  );

  const getFieldLabel = React.useCallback((field) => {
    return field.question?.trim() || fieldTypes[field.fieldType]?.label || "Untitled";
  }, []);

  const onUpdateSection = React.useCallback(
    (key, value) => sectionApi.field.update(key, value),
    [sectionApi]
  );

  const activeChild = React.useMemo(
    () => children.find((c) => c.id === activeChildId) || null,
    [children, activeChildId]
  );

  const childApi = useFormApi(activeChild?.id || '', section.id);
  const validChildApi = activeChild && childApi ? childApi : null;

  const onUpdateChild = React.useCallback(
    (key, value) => {
      if (!activeChild) return;
      if (key === "id") {
        const next = String(value ?? "").trim();
        if (!next) return;

        formStore.getState().updateField(
          activeChild.id,
          { id: next },
          {
            sectionId: section.id,
            onIdChange: (newId, oldId) => {
              setActiveChildId((curr) => (curr === oldId ? newId : curr));
            },
          }
        );
        return;
      }

      formStore.getState().updateField(
        activeChild.id,
        { [key]: value },
        { sectionId: section.id }
      );
    },
    [activeChild, section.id, formStore]
  );

  const onDeleteChild = React.useCallback(() => {
    if (!activeChild) return;
    formStore.getState().deleteField(activeChild.id, { sectionId: section.id });
  }, [activeChild, section.id, formStore]);

  const hasOptionsChild = React.useMemo(
    () => {
      if (!activeChild) return false;
      const childConfig = fieldTypes[activeChild.fieldType] || {};
      return childConfig.hasOptions || false;
    },
    [activeChild]
  );

  const hasMatrixChild = React.useMemo(
    () => {
      if (!activeChild) return false;
      const childConfig = fieldTypes[activeChild.fieldType] || {};
      return childConfig.hasMatrix || false;
    },
    [activeChild]
  );

  return (
    <div className="mie:space-y-4">
      {/* Section Properties */}
      <div className="mie:space-y-3">
        <h3 className="mie:text-sm mie:font-semibold mie:text-gray-700 mie:uppercase mie:tracking-wide">Section Properties</h3>

        <DraftIdEditor
          id={section.id}
          onCommit={(next) => sectionApi.field.renameId(next)}
        />

        <div className="section-editor-title">
          <label className="mie:block mie:text-sm mie:font-medium mie:text-gray-700 mie:mb-1">Section Title</label>
          <input
            className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-gray-300 mie:rounded mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:outline-none"
            value={section.title || ""}
            onChange={(e) => onUpdateSection("title", e.target.value)}
            placeholder="e.g., Patient Information"
          />
        </div>
      </div>

      {/* Field Selection */}
      <div className="mie:space-y-3">
        <h3 className="mie:text-sm mie:font-semibold mie:text-gray-700 mie:uppercase mie:tracking-wide">
          Fields ({children.length})
        </h3>
        
        {children.length === 0 ? (
          <div className="mie:flex mie:flex-col mie:items-center mie:justify-center mie:p-6 mie:bg-gray-50 mie:border-2 mie:border-dashed mie:border-gray-200 mie:rounded-lg mie:text-center">
            <p className="mie:text-sm mie:text-gray-500">No fields in this section</p>
            <p className="mie:text-xs mie:text-gray-400 mie:mt-1">Use the Tool Panel to add fields</p>
          </div>
        ) : (
          <>
            {/* Dropdown Field Selector */}
            <div className="mie:relative">
              <select
                className="mie:w-full mie:px-3 mie:py-2 mie:pr-10 mie:border mie:border-gray-300 mie:rounded mie:bg-white mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:outline-none mie:appearance-none mie:cursor-pointer"
                value={activeChildId || ""}
                onChange={(e) => handleChildSelect(e.target.value)}
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getFieldLabel(c)} — {fieldTypes[c.fieldType]?.label}
                  </option>
                ))}
              </select>
              <ARROWDOWN_ICON className="mie:absolute mie:right-3 mie:top-1/2 mie:-translate-y-1/2 mie:w-4 mie:h-4 mie:text-gray-500 mie:pointer-events-none" />
            </div>

            {activeChild && (
              <div className="mie:space-y-4 mie:p-4 mie:bg-gray-50 mie:border mie:border-gray-200 mie:rounded-lg">
                {/* Field Type Badge */}
                <div className="mie:flex mie:items-center mie:justify-between">
                  <span className="mie:inline-flex mie:items-center mie:px-2.5 mie:py-0.5 mie:rounded-full mie:text-xs mie:font-medium mie:bg-blue-100 mie:text-blue-800">
                    {fieldTypes[activeChild.fieldType]?.label || activeChild.fieldType}
                  </span>
                  <button
                    className="mie:flex mie:items-center mie:gap-1.5 mie:px-3 mie:py-1.5 mie:text-xs mie:font-medium mie:text-red-600 mie:hover:text-red-700 mie:hover:bg-red-50 mie:border mie:border-red-300 mie:rounded mie:transition-colors"
                    onClick={onDeleteChild}
                    title="Delete this field"
                  >
                    <TRASHCANTWO_ICON className="mie:w-3.5 mie:h-3.5" />
                    Delete
                  </button>
                </div>

                {/* Field Editor */}
                <CommonEditor f={activeChild} onUpdateField={onUpdateChild} />

                {activeChild.fieldType === "input" && (
                  <div className="section-editor-default-answer">
                    <label className="mie:block mie:text-sm mie:font-medium mie:text-gray-700 mie:mb-1">Default Answer</label>
                    <input
                      className="mie:w-full mie:px-3 mie:py-2 mie:border mie:border-gray-300 mie:rounded mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:outline-none"
                      value={activeChild.answer || ""}
                      onChange={(e) => onUpdateChild("answer", e.target.value)}
                      placeholder="Default value"
                    />
                  </div>
                )}

                {hasOptionsChild && validChildApi && <OptionListEditor field={activeChild} api={validChildApi} />}

                {hasMatrixChild && validChildApi && <MatrixEditor field={activeChild} api={validChildApi} />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SectionEditor;
