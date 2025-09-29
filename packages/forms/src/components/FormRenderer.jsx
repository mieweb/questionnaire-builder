import React, { useMemo } from "react";
import { fieldTypes } from "@questionnaire-builder/fields";

export default function FormRenderer({ 
  hooks,
  isVisible,
  onSubmit, 
  showSubmitButton = true,
  submitButtonText = "Submit"
}) {
  const fields = hooks.useFieldsArray();

  // Create a wrapper for hooks that forces preview mode
  const previewHooks = useMemo(() => ({
    ...hooks,
    useUIApi: () => ({
      ...hooks.useUIApi(),
      state: {
        ...hooks.useUIApi().state,
        isPreview: true
      }
    })
  }), [hooks]);

  // ────────── Build a flat array including children ──────────
  const allFlat = useMemo(() => {
    const out = [];
    (fields || []).forEach(f => {
      out.push(f);
      if (f?.fieldType === "section" && Array.isArray(f.fields)) out.push(...f.fields);
    });
    return out;
  }, [fields]);

  const visibleIds = useMemo(() => {
    const list = fields.filter((f) => isVisible(f, allFlat));
    return list.map((f) => f.id);
  }, [fields, allFlat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      // Collect form data
      const formData = fields.reduce((acc, field) => {
        acc[field.id] = field.answer || field.selected || null;
        return acc;
      }, {});
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto rounded-lg overflow-y-auto max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)] custom-scrollbar pr-2">
      {visibleIds.length === 0
        ? <EmptyFormState />
        : visibleIds.map((id) => <FieldRow key={id} id={id} hooks={previewHooks} />)}
      
      {showSubmitButton && visibleIds.length > 0 && (
        <div className="mt-6 text-center">
          <button 
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {submitButtonText}
          </button>
        </div>
      )}
    </form>
  );
}

const FieldRow = React.memo(function FieldRow({ id, hooks }) {
  const field = hooks.useFormStore(React.useCallback((s) => s.byId[id], [id]));
  if (!field) return null;

  const FieldComponent = fieldTypes[field.fieldType]?.component;
  return (
    <div className="mb-1.5">
      {FieldComponent ? <FieldComponent field={field} hooks={hooks} /> : null}
    </div>
  );
});

function EmptyFormState() {
  return (
    <div className="flex flex-col items-center justify-center h-72 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-xl shadow-md text-center px-8 py-10">
      <div className="text-xl font-semibold text-gray-700 mb-2">No form fields available</div>
      <div className="text-base text-gray-500">
        This form appears to be empty or no fields are currently visible.
      </div>
    </div>
  );
}