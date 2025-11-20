import React, { useMemo } from "react";
import { fieldTypes, getFieldComponent, useVisibleFields, useFormStore, useUIApi, useUIStore } from "@mieweb/forms-engine";

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
        `form-builder-main w-full 
        ${ui.state.isPreview ? `max-w-4xl` : `max-w-xl`} 
        mx-auto rounded-lg overflow-y-auto max-h-[calc(100svh-24rem)] lg:max-h-[calc(100dvh-20rem)] custom-scrollbar pr-2`
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
    <div className="mb-1.5" data-field-type={field.fieldType} data-field-id={field.id}>
      <FieldComponent field={field} />
    </div>
  );
});

function EmptyState() {
  return (
    <div className="form-builder-empty-state flex flex-col
                    items-center justify-center h-72 bg-gradient-to-br from-gray-50 
                    to-gray-100 border-2 border-dashed border-blue-200 rounded-xl 
                    shadow-md text-center px-8 py-10"
    >
      <div className="empty-state-title text-xl font-semibold text-gray-700 mb-2">Start building your questionnaire</div>
      <div className="empty-state-description text-base text-gray-500">
        Add fields using the <span className="font-semibold text-blue-500">Tool Panel</span> on the left.<br />
        Edit field properties using the <span className="font-semibold text-blue-500">Edit Panel</span> on the right.
      </div>
    </div>
  );
}
