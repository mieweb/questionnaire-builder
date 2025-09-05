
import React, { useState, useEffect, useMemo } from "react";
import OptionListEditor from "./OptionListEditor";
import CommonEditor from "./CommonEditor";
import fieldTypes from "../../../../fields/fieldTypes-config";
import { updateField, updateChildField, deleteChildField } from "../../../../utils/formActions";

// Section Editor with child tabs
function SectionEditor({ section, formData, setFormData, onActiveChildChange }) {
  const children = Array.isArray(section.fields) ? section.fields : [];
  const [activeChildId, setActiveChildId] = useState(children[0]?.id || null);

  // reset tab when a different section is selected
  useEffect(() => {
    setActiveChildId(children[0]?.id || null);
  }, [section.id]);

  useEffect(() => {
    onActiveChildChange?.(section.id, activeChildId || null);
  }, [section.id, activeChildId, onActiveChildChange]);

  const onUpdateSection = (key, value) =>
    updateField(formData, setFormData, section.id, key, value);

  const activeChild = useMemo(
    () => children.find((c) => c.id === activeChildId) || null,
    [children, activeChildId]
  );

  const onUpdateChild = (key, value) =>
    activeChild &&
    updateChildField(formData, setFormData, section.id, activeChild.id, key, value);

  const onDeleteChild = () =>
    activeChild &&
    deleteChildField(formData, setFormData, section.id, activeChild.id);

  const isChoiceChild =
    activeChild && ["radio", "check", "selection"].includes(activeChild.fieldType);

  return (
    <>
      <h3 className="text-lg font-semibold mb-3">Edit Section</h3>

      {/* Section controls */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Section ID</label>
          <input
            className="w-full px-3 py-2 border border-black/20 rounded"
            value={section.id}
            onChange={(e) => onUpdateSection("id", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Section Title</label>
          <input
            className="w-full px-3 py-2 border border-black/20 rounded"
            value={section.title || ""}
            onChange={(e) => onUpdateSection("title", e.target.value)}
            placeholder="Section title"
          />
        </div>
      </div>

      {/* Child tabs */}
      <div className="mt-6">
        <div className="text-sm font-semibold mb-2">Fields in this section</div>
        {children.length === 0 ? (
          <div className="text-sm text-gray-500">No fields yet. Use the section’s mini toolbar to add fields.</div>
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

                {isChoiceChild && (
                  <OptionListEditor field={activeChild} onUpdateField={onUpdateChild} />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SectionEditor;