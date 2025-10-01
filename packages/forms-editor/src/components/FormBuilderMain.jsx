import React, { useMemo } from "react";
import { fieldTypes, getFieldComponent, useFieldsArray, useFormStore, useUIApi, isVisible } from "@mieweb/forms-engine";

// Debug helper (one-time) to inspect registry
if (typeof window !== 'undefined' && !window.__qb_registry_logged) {
  window.__qb_registry_logged = true;
  try {
    // Log only keys to keep noise low
    // eslint-disable-next-line no-console
    console.log('[QB] fieldTypes keys:', Object.keys(fieldTypes));
  } catch {}
}

export default function FormBuilderMain() {
  if (typeof window !== 'undefined') {
    window.__qb_fbm_renders = (window.__qb_fbm_renders || 0) + 1;
    // eslint-disable-next-line no-console
    console.log('[QB] FormBuilderMain render count:', window.__qb_fbm_renders);
  }
  const ui = useUIApi();
  const fields = useFieldsArray();

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
    const list = ui.state.isPreview
      ? fields.filter((f) => isVisible(f, allFlat))
      : fields;
    return list.map((f) => f.id);
  }, [ui.state.isPreview, fields, allFlat]);

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

  if (!FieldComponent) {
    // eslint-disable-next-line no-console
    console.warn('[QB] Missing component for type:', field.fieldType, 'id:', field.id, 'known keys:', Object.keys(fieldTypes));
    return (
      <div className="mb-1.5 border border-red-300 bg-red-50 text-xs p-2 rounded">
        Missing component for fieldType "{field.fieldType}" (id {field.id})
      </div>
    );
  }

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
