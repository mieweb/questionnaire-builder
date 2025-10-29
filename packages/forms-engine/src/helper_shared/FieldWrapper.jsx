import React from "react";
import { EDIT_ICON, TRASHCAN_ICON, VIEWSMALL_ICON, VIEWBIG_ICON } from "./icons";

export default function FieldWrapper({ ctrl, children }) {
  const [open, setOpen] = React.useState(true);

  const onEditClick = (e) => {
    e.stopPropagation();
    if (!ctrl.selected) ctrl.onRowClick?.(e);
    ctrl.toggleEdit();
  };

  const onRemoveClick = (e) => {
    e.stopPropagation();
    ctrl.remove();
  };

  const onRowClick = (e) => {
    if (!ctrl.insideSection) ctrl.onRowClick?.(e);
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
      <div className={`flex justify-between items-center ${open ? "pb-2.5" : ""}`}>
        <div className="text-left w-full select-none">
          {ctrl.insideSection ? (`${ctrl.label}`) :
            (ctrl.field.fieldType === "section" ? (`(${ctrl.label}) ${ctrl.field.title}`) : (`${ctrl.label} ${ctrl.field.question}`))}
        </div>

        {/* actions: Edit (mobile), Toggle (small/big view), Delete */}
        <div className={`flex items-center gap-2 ml-2 ${ctrl.insideSection ? "hidden" : ""}`}>
          <button onClick={onEditClick} className="block lg:hidden" title="Edit" aria-label="Edit field">
            <EDIT_ICON className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls={`fw-body-${ctrl.field?.id}`}
            title={open ? "Collapse" : "Expand"}
            aria-label={open ? "Collapse field" : "Expand field"}
            className="p-1"
          >
            {open ? <VIEWSMALL_ICON className="h-5 w-5" /> : <VIEWBIG_ICON className="h-5 w-5" />}
          </button>

          <button onClick={onRemoveClick} title="Delete" aria-label="Delete field">
            <TRASHCAN_ICON className="h-6 w-6" />
          </button>
        </div>
      </div>

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
