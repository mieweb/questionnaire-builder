import React, { useMemo } from "react";
import { fieldTypes, getFieldComponent, useVisibleFields, useFormStore, useUIApi } from "@mieweb/forms-engine";

export default function FormBuilderMain() {
  const ui = useUIApi();
  const { fields: visibleFields } = useVisibleFields(ui.state.isPreview);

  const visibleIds = useMemo(() => visibleFields.map(f => f.id), [visibleFields]);

  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-lg overflow-y-auto max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)] custom-scrollbar pr-2"
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
    <div className="flex flex-col items-center justify-center h-72 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-blue-200 rounded-xl shadow-md text-center px-8 py-10">
      <div className="text-xl font-semibold text-gray-700 mb-2">Start building your questionnaire</div>
      <div className="text-base text-gray-500">
        Add tools with <span className="font-semibold text-blue-500">Tool Panel</span> on the left.<br />
        Select fields to edit on the <span className="font-semibold text-blue-500">Edit Panel</span> on the left.
      </div>
    </div>
  );
}
