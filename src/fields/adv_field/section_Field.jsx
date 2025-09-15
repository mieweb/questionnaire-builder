import React, { useEffect, useRef } from "react";
import fieldTypes from "../fieldTypes-config";
import { checkFieldVisibility } from "../../utils/visibilityChecker";
import { TRASHCAN_ICON, PLUSSQUARE_ICON, EDIT_ICON } from "../../assets/icons";
import { useFormStore } from "../../state/formStore";
import { useFieldApi } from "../../state/fieldAPI";

function SectionFieldImpl({
  field,
  label,
  onDelete,
  isPreview,
  isEditModalOpen,
  setEditModalOpen,
  highlightChildId = null,
}) {
  // Hook usage is STATIC: these two are always called in the same order/number. updateSelfID / add children
  const sectionSelfApi = useFieldApi(field.id);         
  const sectionChildrenApi = useFieldApi(field.id, field.id); 

  const childRefs = useRef({});
  const children = field.fields || [];
  const toggleEdit = () => setEditModalOpen?.(!isEditModalOpen);

  // ────────── Autoscroll to Child ──────────
  useEffect(() => {
    if (isPreview || !highlightChildId) return;
    const el = childRefs.current[highlightChildId];
    el?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  }, [highlightChildId, isPreview]);

  // ────────── Render Child Preview ──────────
  const renderChildPreview = (child) => {
    const Comp = fieldTypes[child.fieldType]?.component;
    if (!Comp) return null;
    const shouldShow = checkFieldVisibility(child, children);
    if (!shouldShow) return null;

    return (
      <div key={child.id} ref={(el) => el && (childRefs.current[child.id] = el)}>
        <Comp
          field={child}
          label={fieldTypes[child.fieldType]?.label}
          isPreview
          parentType="section"
          sectionId={field.id} 
        />
      </div>
    );
  };

  // ────────── Render Child Edit ──────────
  const renderChildEdit = (child) => {
    const ChildField = fieldTypes[child.fieldType]?.component;
    if (!ChildField) return null;

    const isHighlighted = highlightChildId === child.id;

    const handleDelete = () =>
      useFormStore.getState().deleteField(child.id, { sectionId: field.id });

    return (
      <div
        key={child.id}
        ref={(el) => el && (childRefs.current[child.id] = el)}
        className={[
          "rounded-lg mb-3",
          isHighlighted ? "border-2 border-blue-400 border-dashed" : "border border-transparent",
        ].join(" ")}
      >
        <ChildField
          field={child}
          label={fieldTypes[child.fieldType]?.label}
          onDelete={handleDelete}
          isPreview={isPreview}
          parentType="section"
          sectionId={field.id}   // child binds its own API with sectionId
        />
      </div>
    );
  };

  // ────────── Preview UI ──────────
  if (isPreview) {
    return (
      <section>
        <div className="bg-[#0076a8] text-white text-xl px-4 py-2 rounded-t-lg">
          {field.title || "Section"}
        </div>
        <div className="p-4 bg-white border border-gray-300 rounded-b-lg">
          {children.map(renderChildPreview)}
        </div>
      </section>
    );
  }

  // ────────── Edit UI ──────────
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3 gap-2">
        <div className="flex-1">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-md"
            value={field.title || ""}
            onChange={(e) => sectionSelfApi.field.update("title", e.target.value)}
            placeholder="Section title (e.g., Data Consent)"
          />
        </div>
        <button onClick={toggleEdit} className="block lg:hidden"><EDIT_ICON /></button>
        <button onClick={onDelete}><TRASHCAN_ICON /></button>
      </div>

      {/* Child Fields */}
      <div>{children.map(renderChildEdit)}</div>

      {/* Toolbar to Add Child */}
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Add a field</div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(fieldTypes)
            .filter((t) => t !== "section")
            .map((t) => (
              <button
                key={t}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => sectionChildrenApi.field.add(t)}
              >
                <PLUSSQUARE_ICON className="h-4 w-4" />
                Add {fieldTypes[t].label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

const areEqual = (prev, next) =>
  prev.field === next.field &&
  prev.isPreview === next.isPreview &&
  prev.highlightChildId === next.highlightChildId &&
  prev.onDelete === next.onDelete &&
  prev.isEditModalOpen === next.isEditModalOpen &&
  prev.setEditModalOpen === next.setEditModalOpen;

const SectionField = React.memo(SectionFieldImpl, areEqual);
export default SectionField;
