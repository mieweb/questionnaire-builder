import React from "react";
import { EDIT_ICON, TRASHCAN_ICON, VIEWSMALL_ICON, VIEWBIG_ICON } from "./icons";

export default function FieldWrapper({ ctrl, children, noPadding }) {
  const [open, setOpen] = React.useState(true);

  // ────────── PREVIEW: no collapsible ──────────
  if (ctrl.isPreview || ctrl.insideSection) {
    const wrapperClassName = noPadding && ctrl.isPreview
      ? ctrl.wrapperClass.replace("mie:p-6", "mie:p-0")
      : ctrl.wrapperClass;
    
    // Add border-bottom class for fields inside sections in preview mode only
    const contentClassName = ctrl.insideSection && ctrl.isPreview
      ? "mie:border-b mie:border-mieborder" 
      : "mie:border-0";
    
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
          <div className="field-wrapper-preview-content mie:text-mietext">
            {ctrl.insideSection ? (
              <div>{ctrl.label}</div>
            ) : (
              <div>{`(${ctrl.label})  ${ctrl.field.title}`}</div>
            )}
          </div>
        )}

        <div className={contentClassName}>
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
    ? (ctrl.wrapperClass + " mie:group").replace("mie:p-6", "mie:p-0")
    : (ctrl.wrapperClass + " mie:group");
  
  // Remove padding when collapsed
  if (!open) {
    wrapperClassName = wrapperClassName.replace("mie:p-6", "mie:p-0");
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
      <div className={`field-wrapper-edit-header mie:flex mie:justify-between mie:items-center mie:gap-3 mie:px-3 mie:py-2.5 ${open ? "mie:-mx-6 mie:-mt-6 mie:mb-4" : "mie:m-0"} mie:bg-miebackgroundsecondary mie:border-b mie:border-mieborder ${open ? "mie:rounded-t-lg" : "mie:rounded-lg"} ${ctrl.insideSection ? "mie:hidden" : ""}`}>
        <div className="mie:text-left mie:flex-1 mie:select-none mie:text-sm mie:font-medium mie:text-mietext mie:truncate">
          {ctrl.insideSection ? (`${ctrl.label}`) :
            (ctrl.field.fieldType === "section" ? (`(${ctrl.label}) ${ctrl.field.title || ""}`) : (`${ctrl.label} ${ctrl.field.question || ""}`))}
        </div>

        {/* actions: Edit (mobile), Toggle (small/big view), Delete */}
        <div className="field-wrapper-actions mie:flex mie:items-center mie:gap-1 mie:shrink-0">
          <button onClick={onEditClick} className="field-edit-btn mie:block mie:lg:hidden mie:p-1.5 mie:bg-transparent mie:text-mietextmuted mie:hover:bg-miebackgroundhover mie:rounded mie:transition-colors mie:border-0 mie:outline-none mie:focus:outline-none" title="Edit" aria-label="Edit field">
            <EDIT_ICON className="mie:h-5 mie:w-5 mie:text-mietextmuted" />
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
            className="field-collapse-btn mie:p-1.5 mie:bg-transparent mie:text-mietextmuted mie:hover:bg-miebackgroundhover mie:rounded mie:transition-colors mie:border-0 mie:outline-none mie:focus:outline-none"
          >
            {open ? <VIEWSMALL_ICON className="mie:collapse-icon mie:h-5 mie:w-5 mie:text-mietextmuted" /> : <VIEWBIG_ICON className="mie:collapse-icon mie:h-5 mie:w-5 mie:text-mietextmuted" />}
          </button>

          <button onClick={onRemoveClick} className="field-delete-btn mie:p-1.5 mie:bg-transparent mie:text-mietextmuted mie:hover:bg-miedanger/10 mie:hover:text-miedanger mie:rounded mie:transition-colors mie:border-0 mie:outline-none mie:focus:outline-none" title="Delete" aria-label="Delete field">
            <TRASHCAN_ICON className="mie:h-5 mie:w-5 mie:text-mietextmuted mie:hover:text-miedanger" />
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
