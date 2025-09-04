import React, { useMemo, useState, useEffect } from "react";
import OptionListEditor from "./OptionListEditor";
import fieldTypes from "../../../fields/fieldTypes-config";
import { updateField, updateChildField, deleteChildField } from "../../../utils/formActions";

export default function EditPanel({
  selectedField,
  formData,
  setFormData,
  isPreview,
  onActiveChildChange
}) {

  if (isPreview) return null;

  const isNone = !selectedField;
  const isSection = selectedField?.fieldType === "section";

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
      {/* Placeholder */}
      {isNone && (
        <div className="text-gray-600">
          <h3 className="text-lg font-semibold mb-2">Edit</h3>
          <p>Select a field in the center panel to edit its properties.</p>
        </div>
      )}

      {/* Non-section editor */}
      {!isNone && !isSection && (
        <NonSectionEditor f={selectedField} formData={formData} setFormData={setFormData} />
      )}

      {/* Section editor */}
      {!isNone && isSection && (
        <SectionEditor section={selectedField} formData={formData} setFormData={setFormData} onActiveChildChange={onActiveChildChange} />
      )}
    </div>
  );
}

// Non Section Editor
function NonSectionEditor({ f, formData, setFormData }) {
  const onUpdateField = (key, value) => updateField(formData, setFormData, f.id, key, value);
  const isChoice = ["radio", "check", "selection"].includes(f.fieldType);

  return (
    <>
      <h3 className="text-lg font-semibold mb-3">Edit</h3>
      <CommonEditor f={f} onUpdateField={onUpdateField} />

      {f.fieldType === "input" && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-1">Default Answer</div>
          <input
            className="w-full px-3 py-2 border border-black/20 rounded"
            value={f.answer || ""}
            onChange={(e) => onUpdateField("answer", e.target.value)}
            placeholder="Default value"
          />
        </div>
      )}

      {isChoice && <OptionListEditor field={f} onUpdateField={onUpdateField} />}
    </>
  );
}

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

                <button
                  onClick={onDeleteChild}
                  className="mt-4 px-3 py-2 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
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

// Shared editor for common field properties
function CommonEditor({ f, onUpdateField }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm mb-1">ID</label>
        <input
          className="w-full px-3 py-2 border border-black/20 rounded"
          value={f.id}
          onChange={(e) => onUpdateField("id", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Label / Question</label>
        <input
          className="w-full px-3 py-2 border border-black/20 rounded"
          value={f.question || ""}
          onChange={(e) => onUpdateField("question", e.target.value)}
          placeholder="Enter question text"
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!f.required}
            onChange={(e) => onUpdateField("required", e.target.checked)}
          />
          Required
        </label>
      </div>

      <div>
        <label className="block text-sm mb-1">Sublabel (optional)</label>
        <textarea
          className="w-full px-3 py-2 border border-black/20 rounded"
          value={f.sublabel || ""}
          onChange={(e) => onUpdateField("sublabel", e.target.value)}
          placeholder="Helper text / description"
        />
      </div>
    </div>
  );
}
