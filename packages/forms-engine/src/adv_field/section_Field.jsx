import React, { useEffect, useRef, useMemo } from "react";
import fieldTypes from "../helper_shared/fieldTypes-config.js";
import { isVisible } from "../helper_shared/logicVisibility.js";
import { PLUSSQUARE_ICON } from "../helper_shared/icons.jsx";

import FieldWrapper from "../helper_shared/FieldWrapper.jsx";
import useFieldController from "../helper_shared/useFieldController.jsx";
import { useUIApi } from "../state/uiApi.js";
import { useFormStore } from "../state/formStore.js";

const SectionField = React.memo(function SectionField({ field }) {
  const ctrl = useFieldController(field);
  const ui = useUIApi();

  const parentId = ui.selectedChildId.ParentId;
  const childId  = ui.selectedChildId.ChildId;

  const selectedChildId = parentId === field.id ? childId : null;

  const childRefs = useRef({});

  // ────────── All fields (flat) for visibility evaluation ──────────
  const byId = useFormStore((s) => s.byId);
  const allFlat = useMemo(() => {
    const arr = Object.values(byId);
    const out = [];
    arr.forEach(f => {
      if (!f) return;
      out.push(f);
      if (f.fieldType === "section" && Array.isArray(f.fields)) out.push(...f.fields);
    });
    return out;
  }, [byId]);

  // ────────── Autoscroll to selected child in EDIT mode ──────────
  useEffect(() => {
    if (ctrl.isPreview || !selectedChildId) return;
    const el = childRefs.current[selectedChildId];
    el?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  }, [selectedChildId, ctrl.isPreview]);

  // ────────── Child PREVIEW renderer ──────────
  const renderChildPreview = (child, sectionId) => {
    const Comp = fieldTypes[child.fieldType]?.component;
    if (!Comp) return null;

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
    const ChildField = fieldTypes[child.fieldType]?.component;
    if (!ChildField) return null;

    const isHighlighted = selectedChildId === child.id;

    return (
      <div
        key={child.id}
        ref={(el) => el && (childRefs.current[child.id] = el)}
        className={[
          "rounded-lg mb-3",
          isHighlighted ? "border-2 border-blue-400 border-dashed" : "border border-transparent",
        ].join(" ")}
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
            <section className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="bg-[#0076a8] text-white text-xl px-4 py-2 rounded-t-lg">
                {f.title || "Section"}
              </div>
              {children.map((c) => renderChildPreview(c, f.id))}
            </section>
          );
        }

        return (
          <div>
            <div className="flex justify-between items-center mb-3 gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  value={f.title || ""}
                  onChange={(e) => api.field.update("title", e.target.value)}
                  placeholder="Section title (e.g., Data Consent)"
                />
              </div>
            </div>

            <div>{children.map((c) => renderChildEdit(c, f.id))}</div>

            <div className="mb-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Add a field</div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(fieldTypes)
                  .filter((t) => t !== "section")
                  .map((t) => (
                    <button
                      key={t}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() =>
                        api.section?.addChild
                          ? api.section.addChild(t)
                          : api.field.add?.(t, undefined, undefined)
                      }
                    >
                      <PLUSSQUARE_ICON className="h-4 w-4" />
                      Add {fieldTypes[t].label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default SectionField;
