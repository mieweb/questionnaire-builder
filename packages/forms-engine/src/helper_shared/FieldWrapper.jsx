import React from "react";
import { EDIT_ICON, TRASHCAN_ICON, VIEWSMALL_ICON, VIEWBIG_ICON } from "./icons";

export default function FieldWrapper({ ctrl, children, noPadding }) {
  const [open, setOpen] = React.useState(true);

  // ────────── PREVIEW: no collapsible ──────────
  if (ctrl.isPreview || ctrl.insideSection) {
    const wrapperClassName = noPadding && ctrl.isPreview
      ? ctrl.wrapperClass.replace("p-6", "p-0")
      : ctrl.wrapperClass;
    
    return (
      <div
        className={wrapperClassName}
        onClick={!ctrl.insideSection ? ctrl.onRowClick : undefined}
        data-field-id={ctrl.field?.id}
        data-inside-section={ctrl.insideSection ? "true" : "false"}
        data-selected={ctrl.selected ? "true" : "false"}
        aria-selected={ctrl.selected || undefined}
        tabIndex={-1}
      >
        {!ctrl.isPreview && (
          <div className="field-wrapper-preview-content">
            {ctrl.insideSection ? (
              <div>{ctrl.label}</div>
            ) : (
              <div>{`(${ctrl.label})  ${ctrl.field.title}`}</div>
            )}
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
            placeholder: ctrl.placeholder,
          })
          : children}
      </div>
    );
  }

  // ────────── EDIT: collapsible  ──────────
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
  let wrapperClassName = noPadding 
    ? (ctrl.wrapperClass + " group").replace("p-6", "p-0")
    : (ctrl.wrapperClass + " group");
  
  // Remove padding when collapsed
  if (!open) {
    wrapperClassName = wrapperClassName.replace("p-6", "p-0");
  }
  
  return (
    <div
      className={wrapperClassName}
      onClick={onRowClick}
      data-field-id={ctrl.field?.id}
      data-inside-section={ctrl.insideSection ? "true" : "false"}
      data-selected={ctrl.selected ? "true" : "false"}
      aria-selected={ctrl.selected || undefined}
      tabIndex={-1}
    >
      <div className={`field-wrapper-edit-header flex justify-between items-center gap-3 px-3 py-2.5 ${open ? "-mx-6 -mt-6 mb-4" : "m-0"} bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200 ${open ? "rounded-t-lg" : "rounded-lg"} ${ctrl.insideSection ? "hidden" : ""}`}>
        <div className="text-left flex-1 select-none text-sm font-medium text-gray-700 truncate">
          {ctrl.insideSection ? (`${ctrl.label}`) :
            (ctrl.field.fieldType === "section" ? (`(${ctrl.label}) ${ctrl.field.title || ""}`) : (`${ctrl.label} ${ctrl.field.question || ""}`))}
        </div>

        {/* actions: Edit (mobile), Toggle (small/big view), Delete */}
        <div className="field-wrapper-actions flex items-center gap-1 shrink-0">
          <button onClick={onEditClick} className="field-edit-btn block lg:hidden p-1.5 hover:bg-white rounded transition-colors" title="Edit" aria-label="Edit field">
            <EDIT_ICON className="h-5 w-5 text-gray-600" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!ctrl.selected) ctrl.onRowClick?.(e);
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls={`fw-body-${ctrl.field?.id}`}
            title={open ? "Collapse" : "Expand"}
            aria-label={open ? "Collapse field" : "Expand field"}
            className="field-collapse-btn p-1.5 hover:bg-white rounded transition-colors"
          >
            {open ? <VIEWSMALL_ICON className="collapse-icon h-5 w-5 text-gray-600" /> : <VIEWBIG_ICON className="collapse-icon h-5 w-5 text-gray-600" />}
          </button>

          <button onClick={onRemoveClick} className="field-delete-btn p-1.5 hover:bg-red-50 rounded transition-colors" title="Delete" aria-label="Delete field">
            <TRASHCAN_ICON className="h-5 w-5 text-gray-600 hover:text-red-600" />
          </button>
        </div>
      </div>

      {open && (
        <div id={`fw-body-${ctrl.field?.id}`} className="field-wrapper-body">
          {typeof children === "function"
            ? children({
              api: ctrl.api,
              isPreview: ctrl.isPreview,
              field: ctrl.field,
              insideSection: ctrl.insideSection,
              sectionId: ctrl.sectionId,
              selected: ctrl.selected,
              placeholder: ctrl.placeholder,
            })
            : children}
        </div>
      )}
    </div>
  );
}
