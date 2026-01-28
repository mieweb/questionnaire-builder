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

  // Use reactive selectedChild instead of direct property access
  const selectedChild = useUIStore((s) => s.selectedChildId);
  const selectedChildId = selectedChild.parentId === field.id ? selectedChild.childId : null;

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

  // Auto-scroll to newly added field (only in build/edit mode, not preview)
  React.useEffect(() => {
    if (ctrl.isPreview) return; // Don't auto-scroll in preview mode
    
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
  }, [field.fields, field.id, ui.selectedChildId, ctrl.isPreview]);

  // Auto-scroll when selected child changes (e.g., from SectionEditor dropdown)
  // Only in build/edit mode, not preview
  React.useEffect(() => {
    if (ctrl.isPreview) return; // Don't auto-scroll in preview mode
    
    if (selectedChildId && childRefs.current[selectedChildId]) {
      setTimeout(() => {
        const el = childRefs.current[selectedChildId];
        el?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
      }, 0);
    }
  }, [selectedChildId, ctrl.isPreview]);

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
          "mie:rounded-lg mie:mb-3 mie:cursor-pointer",
          isHighlighted ? "mie:border-2 mie:border-mieprimary mie:border-dashed" : "mie:border mie:border-transparent",
        ].join(" ")}
        onClick={(e) => {
          e.stopPropagation();
          // Only set selectedFieldId if it's not already the section
          if (ui.selectedFieldId.value !== sectionId) {
            ui.selectedFieldId.set(sectionId);
          }
          ui.selectedChildId.set(sectionId, child.id);
        }}
      >
        <ChildField field={child} sectionId={sectionId} />
      </div>
    );
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, instanceId }) => {
        const children = Array.isArray(f.fields) ? f.fields : [];

        if (isPreview) {
          return (
            <section className="section-field-preview">
              <div className="mie:bg-mieprimary mie:text-mietextsecondary mie:text-xl mie:px-4 mie:py-2 mie:rounded-t-lg mie:wrap-break-word mie:overflow-hidden">
                {f.title || "Section"}
              </div>
              {children.map((c) => renderChildPreview(c, f.id))}
            </section>
          );
        }

        const isEmpty = children.length === 0;

        return (
          <div className="section-field-edit">
            <div className="mie:flex mie:justify-between mie:items-center mie:mb-3 mie:gap-2 section-field-header">
              <div className="mie:flex-1">
                <input
                  type="text"
                  className="mie:w-full mie:min-w-0 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
                  value={f.title || ""}
                  onChange={(e) => api.field.update("title", e.target.value)}
                  placeholder="Section title (e.g., Data Consent)"
                />
              </div>
            </div>
            {isEmpty ? (
              <div className="mie:flex mie:flex-col mie:items-center mie:justify-center mie:p-8 mie:bg-linear-to-br mie:from-miebackground mie:to-mieborder/30 mie:border-2 mie:border-dashed mie:border-mieprimary/30 mie:rounded-lg mie:shadow-md mie:text-center">
                <p className="mie:text-sm mie:font-semibold mie:text-mietext mie:mb-2">No fields in this section</p>
                <p className="mie:text-xs mie:text-mietextmuted mie:leading-relaxed">
                  Use the <span className="mie:font-semibold mie:text-mieprimary">Tool Panel</span> on the left to add fields.
                  <br />
                  Press <span className="mie:font-semibold mie:text-mieprimary">ESC</span> or click <span className="mie:font-semibold mie:text-mieprimary">X</span> to unselect.
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
