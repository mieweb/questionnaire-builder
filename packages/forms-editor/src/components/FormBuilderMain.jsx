import React, { useMemo } from "react";
import { getFieldComponent, useVisibleFields, useFormStore, useUIApi, useUIStore } from "@mieweb/forms-engine";

export default function FormBuilderMain() {
  const ui = useUIApi();
  const { fields: visibleFields } = useVisibleFields(ui.state.isPreview);
  const hideUnsupportedFields = useUIStore((s) => s.hideUnsupportedFields);
  const order = useFormStore((s) => s.order);
  const containerRef = React.useRef(null);
  const previousOrderLengthRef = React.useRef(0);

  const visibleIds = useMemo(() => {
    const filtered = hideUnsupportedFields
      ? visibleFields.filter(f => f.fieldType !== 'unsupported')
      : visibleFields;
    return filtered.map(f => f.id);
  }, [visibleFields, hideUnsupportedFields]);

  // Auto-scroll and auto-select newly added field (only in edit mode, only when order length increases)
  React.useEffect(() => {
    if (ui.state.isPreview) return; // Don't auto-select in preview mode
    if (order.length > previousOrderLengthRef.current) {
      // A field was actually added to the form (order array increased)
      const lastFieldId = order[order.length - 1];
      const lastField = containerRef.current?.querySelector(`[data-field-id="${lastFieldId}"]`);
      if (lastField) {
        lastField.scrollIntoView({ behavior: "smooth", block: "nearest" });
        ui.selectedFieldId.set(lastFieldId);
      }
    }
    previousOrderLengthRef.current = order.length;
  }, [order, ui.selectedFieldId, ui.state.isPreview]);

  return (
    <div
      ref={containerRef}
      className={
        `form-builder-main 
        ${ui.state.isPreview ? `mie:max-w-4xl` : `mie:max-w-xl`} 
        mie:mx-auto mie:rounded-lg mie:overflow-y-auto mie:max-h-[calc(100svh-13rem)] mie:lg:max-h-[calc(100dvh-11rem)] mie:custom-scrollbar mie:lg:pr-2`
      }
      onClick={() => !ui.state.isPreview && ui.selectedFieldId.clear()}
    >
      {visibleIds.length === 0
        ? <EmptyState />
        : visibleIds.map((id) => <FieldRow key={id} id={id} />)}
    </div>
  );
}

const FieldRow = React.memo(function FieldRow({ id }) {
  const field = useFormStore(React.useCallback((s) => s.byId[id], [id]));

  if (!field) return null;

  const FieldComponent = getFieldComponent(field.fieldType);

  if (!FieldComponent) return null;

  return (
    <div className="mie:mb-1.5" data-field-type={field.fieldType} data-field-id={field.id}>
      <FieldComponent field={field} />
    </div>
  );
});

function EmptyState() {
  return (
    <div className="form-builder-empty-state mie:flex mie:flex-col mie:items-center mie:justify-center mie:h-72 mie:bg-miebackground mie:border-2 mie:border-dashed mie:border-mieprimary/30 mie:rounded-xl mie:shadow-md mie:text-center mie:px-8 mie:py-10"
    >
      <div className="empty-state-title mie:text-xl mie:font-semibold mie:text-mietext mie:mb-2">Forms</div>
      <div className="empty-state-description mie:text-base mie:text-mietextmuted">
        <div className="mie:lg:hidden">
          Tap the <span className="mie:font-semibold mie:text-mieprimary">Tool Panel</span> button to add fields.
        </div>
        <div className="mie:hidden mie:lg:block">
          Add fields using the <span className="mie:font-semibold mie:text-mieprimary">Tool Panel</span> on the left.<br />
          Edit field properties using the <span className="mie:font-semibold mie:text-mieprimary">Edit Panel</span> on the right.
        </div>
      </div>
    </div>
  );
}
