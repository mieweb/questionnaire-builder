import React, { useState } from "react";
import { EDIT_ICON, TRASHCAN_ICON } from "../../assets/icons";

export default function FieldWrapper({ ctrl, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const onEditClick = (e) => {
    e.stopPropagation();
    ctrl.toggleEdit();
  };

  const onRemoveClick = (e) => {
    e.stopPropagation();
    ctrl.remove();
  };

  // ────────── Preview: no <details>, no <summary> ──────────
  if (ctrl.isPreview) {
    return (
      <div
        className={ctrl.wrapperClass}
        onClick={!ctrl.insideSection ? ctrl.onRowClick : undefined}
        data-field-id={ctrl.field?.id}
        data-inside-section={ctrl.insideSection ? "true" : "false"}
        data-selected={ctrl.selected ? "true" : "false"}
        aria-selected={ctrl.selected || undefined}
        tabIndex={-1}
      >
        {typeof children === "function"
          ? children({
              api: ctrl.api,
              isPreview: ctrl.isPreview,
              field: ctrl.field,
              insideSection: ctrl.insideSection,
              sectionId: ctrl.sectionId,
              selected: ctrl.selected,
            })
          : children}
      </div>
    );
  }

  // ────────── Edit: collapsible with <details>/<summary> ──────────
  return (
    <details
      className={ctrl.wrapperClass + " group"}
      onClick={!ctrl.insideSection ? ctrl.onRowClick : undefined}
      data-field-id={ctrl.field?.id}
      data-inside-section={ctrl.insideSection ? "true" : "false"}
      data-selected={ctrl.selected ? "true" : "false"}
      aria-selected={ctrl.selected || undefined}
      tabIndex={-1}
      open={isOpen}
    >
      <summary className="flex justify-between group-open:pb-2.5 select-none">
        {ctrl.label}
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={onEditClick}
            className={`block lg:hidden ${ctrl.insideSection ? "hidden" : ""}`}
            title="Edit"
          >
            {/* ────────── Edit ────────── */}
            <EDIT_ICON className="h-6 w-6" />
          </button>
          <button onClick={onRemoveClick} title="Delete" aria-label="Delete field">
            {/* ────────── Delete ────────── */}
            <TRASHCAN_ICON className="h-6 w-6" />
          </button>
        </div>
      </summary>

      {typeof children === "function"
        ? children({
            api: ctrl.api,
            isPreview: ctrl.isPreview,
            field: ctrl.field,
            insideSection: ctrl.insideSection,
            sectionId: ctrl.sectionId,
            selected: ctrl.selected,
          })
        : children}
    </details>
  );
}
