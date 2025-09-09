import React, { useEffect, useRef, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import fieldTypes from "../fieldTypes-config";
import { checkFieldVisibility } from "../../utils/visibilityChecker";
import { TRASHCAN_ICON, PLUSSQUARE_ICON, EDIT_ICON } from "../../assets/icons";
import { useFieldApi } from "../../state/formStore";

const EMPTY = Object.freeze([]);

function SectionFieldImpl({
  field,
  onDelete,            
  isPreview,
  highlightChildId = null,
  isEditModalOpen,
  setEditModalOpen
}) {
  const api = useFieldApi(field.id);
  const childRefs = useRef({});

  const children = field.fields ?? EMPTY;      
  const toggleEdit = () => setEditModalOpen?.(!isEditModalOpen);


  const addChild = (type) => {
    if (type === "section") return;
    const tpl = fieldTypes[type]?.defaultProps;
    if (!tpl) return;
    api.section.addChild(type); 
  };

  {/* ────────── Render Child Preview ──────────  */} 
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
          onUpdate={(k, v) => api.section.updateChild(child.id, { [k]: v })}
          isPreview
          parentType="section"
        />
      </div>
    );
  };

  {/* ────────── Render Child Edit ──────────  */} 
  const renderChildEdit = (child) => {
    const Comp = fieldTypes[child.fieldType]?.component;
    if (!Comp) return null;

    const isHighlighted = highlightChildId === child.id;

    return (
      <div
        key={child.id}
        ref={(el) => el && (childRefs.current[child.id] = el)}
        className={[
          "rounded-lg mb-3",
          isHighlighted ? "border-2 border-blue-400 border-dashed" : "border border-transparent",
        ].join(" ")}
      >
        <Comp
          field={child}
          label={fieldTypes[child.fieldType]?.label}
          onUpdate={(k, v) => api.section.updateChild(child.id, { [k]: v })}
          onDelete={() => api.section.removeChild(child.id)}
          isPreview={false}
          parentType="section"
        />
      </div>
    );
  };

  {/* ────────── Autoscroll to Child ──────────  */} 
  useEffect(() => {
    if (isPreview || !highlightChildId) return;
    const el = childRefs.current[highlightChildId];
    el?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  }, [highlightChildId, isPreview]);

  {/* ────────── Preview UI ──────────  */} 
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

  {/* ────────── Edit UI ──────────  */} 
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3 gap-2">
        <div className="flex-1">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-md"
            value={field.title || ""}
            onChange={(e) => api.field.update("title", e.target.value)}
            placeholder="Section title (e.g., Data Consent)"
          />
        </div>
        <button onClick={toggleEdit} className="block lg:hidden"><EDIT_ICON /></button>
        <button onClick={onDelete}><TRASHCAN_ICON /></button>
      </div>

      {/* ────────── Child Field ──────────  */} 
      <div>{children.map(renderChildEdit)}</div>

      {/* ────────── Toolbar to Add Child ──────────  */} 
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Add a field</div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(fieldTypes)
            .filter((t) => t !== "section")
            .map((t) => (
              <button
                key={t}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => addChild(t)}
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

{/* ────────── Memo ──────────  */} 
const areEqual = (prev, next) =>
  prev.field === next.field &&                      
  prev.isPreview === next.isPreview &&
  prev.highlightChildId === next.highlightChildId &&
  prev.onDelete === next.onDelete &&
  prev.isEditModalOpen === next.isEditModalOpen &&
  prev.setEditModalOpen === next.setEditModalOpen;

const SectionField = React.memo(SectionFieldImpl, areEqual);
export default SectionField;
