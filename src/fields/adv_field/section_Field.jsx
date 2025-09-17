import React, { useEffect, useRef } from "react";
import fieldTypes from "../fieldTypes-config";
import { checkFieldVisibility } from "../../utils/visibilityChecker";
import { PLUSSQUARE_ICON } from "../../assets/icons";

import FieldWrapper from "../shared/FieldWrapper";
import { useFieldController } from "../shared/useFieldController";
import { useUIStore } from "../../state/uiStore";

const SectionField = React.memo(function SectionField({ field }) {
  // ────────── Controller for this section (top-level; no parent sectionId) ──────────
  const ctrl = useFieldController(field);

  // ────────── Read highlight for this section from UI store (no prop drilling) ──────────
  const highlightChildId = useUIStore((s) => s.getSectionHighlightId(field.id));

  const childRefs = useRef({});

  // ────────── Autoscroll to highlighted child in EDIT mode ──────────
  useEffect(() => {
    if (ctrl.isPreview || !highlightChildId) return;
    const el = childRefs.current[highlightChildId];
    el?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  }, [highlightChildId, ctrl.isPreview]);

  // ────────── Child PREVIEW renderer ──────────
  const renderChildPreview = (child, siblings, sectionId) => {
    const Comp = fieldTypes[child.fieldType]?.component;
    if (!Comp) return null;

    const visible = checkFieldVisibility(child, siblings);
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
        <ChildField field={child} sectionId={sectionId} />
      </div>
    );
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f }) => {
        // ────────── Always derive from latest field snapshot ──────────
        const children = Array.isArray(f.fields) ? f.fields : [];

        // ────────── Preview (early return) ──────────
        if (isPreview) {
          return (
            <section className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="bg-[#0076a8] text-white text-xl px-4 py-2 rounded-t-lg">
                {f.title || "Section"}
              </div>
              {children.map((c) => renderChildPreview(c, children, f.id))}
            </section>
          );
        }

        // ────────── Edit (early return) ──────────
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

            {/* ────────── Child Fields ────────── */}
            <div>{children.map((c) => renderChildEdit(c, f.id))}</div>

            {/* ────────── Toolbar to Add Child ────────── */}
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
