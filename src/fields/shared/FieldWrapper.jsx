import React, { useEffect, useState } from "react";
import { EDIT_ICON, TRASHCAN_ICON } from "../../assets/icons";

export default function FieldWrapper({ ctrl, children }) {
  const [open, setOpen] = useState(true);

  const onEditClick = (e) => {
    e.stopPropagation();
    ctrl.toggleEdit();
  };

  const onRemoveClick = (e) => {
    e.stopPropagation();
    ctrl.remove();
  };

  const onRowClick = (e) => {
    if (!ctrl.insideSection) ctrl.onRowClick?.(e);
    if (!open) setOpen(true);
  };

  // ────────── PREVIEW: no collapsible ──────────
  if (ctrl.isPreview || ctrl.insideSection) {
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

        {ctrl.isPreview ? null
          : (
            <div>
              {ctrl.insideSection ? (`${ctrl.label}`) : (`(${ctrl.label})  ${ctrl.field.title}`)}
            </div>
          )}


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

  // ────────── EDIT: collapsible  ──────────
  return (
    <div
      className={ctrl.wrapperClass + " group"}
      onClick={onRowClick}
      data-field-id={ctrl.field?.id}
      data-inside-section={ctrl.insideSection ? "true" : "false"}
      data-selected={ctrl.selected ? "true" : "false"}
      aria-selected={ctrl.selected || undefined}
      tabIndex={-1}
    >
      {/* ────────── Header (button toggles; also selects) ────────── */}
      <div className="flex justify-between pb-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!ctrl.insideSection) ctrl.onRowClick?.(e);
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-controls={`fw-body-${ctrl.field?.id}`}
          className="text-left w-full cursor-pointer select-none"
        >
          {ctrl.insideSection ? (`${ctrl.label}`) : (`(${ctrl.label})  ${ctrl.field.title}`)}
        </button>

        <div className={`flex items-center gap-2 ml-2 ${ctrl.insideSection ? "hidden" : ""}`}>
          <button onClick={onEditClick} className="block lg:hidden" title="Edit" aria-label="Edit field">
            <EDIT_ICON className="h-6 w-6" />
          </button>
          <button onClick={onRemoveClick} title="Delete" aria-label="Delete field">
            <TRASHCAN_ICON className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* ────────── Body (collapsible) ────────── */}
      {open && (
        <div id={`fw-body-${ctrl.field?.id}`}>
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
      )}
    </div>
  );
}
