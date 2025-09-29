import React, { useMemo } from "react";
import { fieldTypes } from "@questionnaire-builder/fields";

export default function FormPreview({ hooks, isVisible }) {
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

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg overflow-y-auto max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)] custom-scrollbar pr-2">
      {visibleIds.length === 0
        ? <EmptyPreviewState />
        : visibleIds.map((id) => <FieldRow key={id} id={id} hooks={previewHooks} />)}
    </div>
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

function EmptyPreviewState() {
  return (
    <div className="flex flex-col items-center justify-center h-72 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-xl shadow-md text-center px-8 py-10">
      <div className="text-xl font-semibold text-gray-700 mb-2">Preview your questionnaire</div>
      <div className="text-base text-gray-500">
        Add fields to your questionnaire to see how it will look to users.
      </div>
    </div>
  );
}