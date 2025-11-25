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
  const [activeChildId, setActiveChildId] = React.useState(children[0]?.id || null);

  // Sync with global selectedChildId from section
  React.useEffect(() => {
    const globalParentId = ui.selectedChildId.ParentId;
    const globalChildId = ui.selectedChildId.ChildId;
    if (globalParentId === section.id && globalChildId) {
      setActiveChildId(globalChildId);
    }
  }, [ui.selectedChildId.ParentId, ui.selectedChildId.ChildId, section.id]);

  React.useEffect(() => {
    setActiveChildId(children[0]?.id || null);
  }, [section.id]);

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
    <div className="space-y-4">
      {/* Section Properties */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Section Properties</h3>

        <DraftIdEditor
          id={section.id}
          onCommit={(next) => sectionApi.field.renameId(next)}
        />

        <div className="section-editor-title">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
            value={section.title || ""}
            onChange={(e) => onUpdateSection("title", e.target.value)}
            placeholder="e.g., Patient Information"
          />
        </div>
      </div>

      {/* Field Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Fields ({children.length})
        </h3>
        
        {children.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-500">No fields in this section</p>
            <p className="text-xs text-gray-400 mt-1">Use the Tool Panel to add fields</p>
          </div>
        ) : (
          <>
            {/* Dropdown Field Selector */}
            <div className="relative">
              <select
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none appearance-none cursor-pointer"
                value={activeChildId || ""}
                onChange={(e) => handleChildSelect(e.target.value)}
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getFieldLabel(c)} — {fieldTypes[c.fieldType]?.label}
                  </option>
                ))}
              </select>
              <ARROWDOWN_ICON className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {activeChild && (
              <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                {/* Field Type Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {fieldTypes[activeChild.fieldType]?.label || activeChild.fieldType}
                  </span>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded transition-colors"
                    onClick={onDeleteChild}
                    title="Delete this field"
                  >
                    <TRASHCANTWO_ICON className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>

                {/* Field Editor */}
                <CommonEditor f={activeChild} onUpdateField={onUpdateChild} />

                {activeChild.fieldType === "input" && (
                  <div className="section-editor-default-answer">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Answer</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
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
