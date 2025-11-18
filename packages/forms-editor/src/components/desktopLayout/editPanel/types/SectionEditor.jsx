import React from "react";
import OptionListEditor from "./OptionListEditor";
import MatrixEditor from "./MatrixEditor";
import CommonEditor from "./CommonEditor";
import { fieldTypes, FormStoreContext, useFormApi } from "@mieweb/forms-engine";
import DraftIdEditor from "./DraftIdEditor"

function SectionEditor({ section, onActiveChildChange }) {
  const sectionApi = useFormApi(section.id);
  const formStore = React.useContext(FormStoreContext);

  if (!formStore) throw new Error('Missing FormStoreContext.Provider in the tree');

  const children = Array.isArray(section.fields) ? section.fields : [];
  const [activeChildId, setActiveChildId] = React.useState(children[0]?.id || null);

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
    <>
      <h3 className="text-lg font-semibold mb-3">Edit Section</h3>

      <DraftIdEditor
        id={section.id}
        onCommit={(next) => sectionApi.field.renameId(next)}
      />

      <div className="mt-3">
        <label className="block text-sm mb-1">Section Title</label>
        <input
          className="w-full px-3 py-2 border border-black/20 rounded"
          value={section.title || ""}
          onChange={(e) => onUpdateSection("title", e.target.value)}
          placeholder="Section title"
        />
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold mb-2">Fields in this section</div>
        {children.length === 0 ? (
          <div className="text-sm text-gray-500">
            No fields yet. Use the section’s mini toolbar to add fields.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {children.map((c) => (
                <button
                  key={c.id}
                  className={[
                    "px-3 py-1.5 text-sm rounded border",
                    activeChildId === c.id
                      ? "bg-black/5 border-black/20"
                      : "bg-white border-black/10 hover:bg-slate-50",
                  ].join(" ")}
                  onClick={() => setActiveChildId(c.id)}
                  title={c.question || c.fieldType}
                >
                  {c.question?.trim() || fieldTypes[c.fieldType]?.label || "Field"}
                </button>
              ))}
            </div>

            {activeChild && (
              <div className="mt-2">
                <div className="text-sm font-semibold mb-2">
                  Editing: {activeChild.question?.trim() || fieldTypes[activeChild.fieldType]?.label}
                </div>

                <CommonEditor f={activeChild} onUpdateField={onUpdateChild} />

                {activeChild.fieldType === "input" && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">Default Answer</div>
                    <input
                      className="w-full px-3 py-2 border border-black/20 rounded"
                      value={activeChild.answer || ""}
                      onChange={(e) => onUpdateChild("answer", e.target.value)}
                      placeholder="Default value"
                    />
                  </div>
                )}

                {hasOptionsChild && validChildApi && <OptionListEditor field={activeChild} api={validChildApi} />}

                {hasMatrixChild && validChildApi && <MatrixEditor field={activeChild} api={validChildApi} />}

                <button
                  className="mt-3 px-3 py-2 text-sm text-red-400 border rounded"
                  onClick={onDeleteChild}
                >
                  Delete this field
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SectionEditor;
