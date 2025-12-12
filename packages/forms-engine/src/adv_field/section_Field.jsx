import React from "react";
import fieldTypes, { registerFieldComponent, getFieldComponent } from "../helper_shared/fieldTypes-config.js";
import { isVisible } from "../helper_shared/logicVisibility.js";
import { PLUSSQUARE_ICON } from "../helper_shared/icons.jsx";

import FieldWrapper from "../helper_shared/FieldWrapper.jsx";
import useFieldController from "../helper_shared/useFieldController.jsx";
import { useUIApi } from "../state/uiApi.js";
import { useFormStore } from "../state/formStore.js";
import { useUIStore } from "../state/uiStore.js";

const SectionField = React.memo(function SectionField({ field }) {
  const ctrl = useFieldController(field);
  const ui = useUIApi();
  const hideUnsupportedFields = useUIStore((s) => s.hideUnsupportedFields);

  const parentId = ui.selectedChildId.ParentId;
  const childId = ui.selectedChildId.ChildId;

  const selectedChildId = parentId === field.id ? childId : null;

  const childRefs = React.useRef({});
  const previousChildCountRef = React.useRef(0);

  const byId = useFormStore((s) => s.byId);
  const allFlat = React.useMemo(() => {
    const arr = Object.values(byId);
    const out = [];
    arr.forEach(f => {
      if (!f) return;
      out.push(f);
      if (f.fieldType === "section" && Array.isArray(f.fields)) out.push(...f.fields);
    });
    return out;
  }, [byId]);

  // Auto-scroll to newly added field
  React.useEffect(() => {
    const currentChildCount = Array.isArray(field.fields) ? field.fields.length : 0;
    if (currentChildCount > previousChildCountRef.current && currentChildCount > 0) {
      // A field was added, scroll to the last one and select it
      const lastChild = field.fields[field.fields.length - 1];
      if (lastChild) {
        // Select the newly added field
        ui.selectedChildId.set(field.id, lastChild.id);
        
        setTimeout(() => {
          const el = childRefs.current[lastChild.id];
          el?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
        }, 0);
      }
    }
    previousChildCountRef.current = currentChildCount;
  }, [field.fields, field.id, ui.selectedChildId]);

  // Auto-scroll when selected child changes (e.g., from SectionEditor dropdown)
  React.useEffect(() => {
    if (selectedChildId && childRefs.current[selectedChildId]) {
      setTimeout(() => {
        const el = childRefs.current[selectedChildId];
        el?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
      }, 0);
    }
  }, [selectedChildId]);

  // ────────── Helper: Check if child should be hidden ──────────
  const shouldHideChild = (child) => {
    return hideUnsupportedFields && child.fieldType === 'unsupported';
  };

  // ────────── Child PREVIEW renderer ──────────
  const renderChildPreview = (child, sectionId) => {
    const Comp = getFieldComponent(child.fieldType);
    if (!Comp) return null;
    if (shouldHideChild(child)) return null;

    const visible = isVisible(child, allFlat);
    if (!visible) return null;

    return (
      <div key={child.id} ref={(el) => el && (childRefs.current[child.id] = el)}>
        <Comp field={child} sectionId={sectionId} />
      </div>
    );
  };

  // ────────── Child EDIT renderer ──────────
  const renderChildEdit = (child, sectionId) => {
    const ChildField = getFieldComponent(child.fieldType);
    if (!ChildField) return null;
    if (shouldHideChild(child)) return null;

    const isHighlighted = selectedChildId === child.id;

    return (
      <div
        key={child.id}
        ref={(el) => el && (childRefs.current[child.id] = el)}
        className={[
          "rounded-lg mb-3 cursor-pointer",
          isHighlighted ? "border-2 border-blue-400 border-dashed" : "border border-transparent",
        ].join(" ")}
        onClick={(e) => {
          e.stopPropagation();
          ui.selectedFieldId.set(sectionId);
          ui.selectedChildId.set(sectionId, child.id);

        }}
      >
        <ChildField field={child} sectionId={sectionId} />
      </div>
    );
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f }) => {
        const children = Array.isArray(f.fields) ? f.fields : [];

        if (isPreview) {
          return (
            <section className={`section-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="bg-blue-500 text-white text-xl px-4 py-2 rounded-t-lg break-words overflow-hidden">
                {f.title || "Section"}
              </div>
              {children.map((c) => renderChildPreview(c, f.id))}
            </section>
          );
        }

        const isEmpty = children.length === 0;

        return (
          <div className="section-field-edit">
            <div className="flex justify-between items-center mb-3 gap-2 section-field-header">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                  value={f.title || ""}
                  onChange={(e) => api.field.update("title", e.target.value)}
                  placeholder="Section title (e.g., Data Consent)"
                />
              </div>
            </div>
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-blue-200 rounded-lg shadow-md text-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">No fields in this section</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Use the <span className="font-semibold text-blue-500">Tool Panel</span> on the left to add fields.
                  <br />
                  Press <span className="font-semibold text-blue-500">ESC</span> or click <span className="font-semibold text-blue-500">X</span> to unselect.
                </p>
              </div>
            ) : (
              <div>{children.map((c) => renderChildEdit(c, f.id))}</div>
            )}
          </div>
        );
      }}
    </FieldWrapper>
  );
});

// Register component via helper (avoids direct mutation patterns elsewhere)
registerFieldComponent('section', SectionField);

export default SectionField;
