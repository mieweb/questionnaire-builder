import React, { useMemo, useCallback } from "react";
import fieldTypes from "../fields/fieldTypes-config";
import { useFieldsArray, useFormStore } from "../state/formStore";
import { useUIStore } from "../state/uiStore";
import { checkFieldVisibility } from "../utils/visibilityChecker";

export default function FormBuilderMain() {
  const isPreview = useUIStore((s) => s.isPreview);
  const selectedFieldId = useUIStore((s) => s.selectedFieldId);
  const selectField = useUIStore((s) => s.selectField);

  const isEditModalOpen = useUIStore((s) => s.isEditModalOpen);
  const setEditModalOpen = useUIStore((s) => s.setEditModalOpen);

  const getSectionHighlightId = useUIStore((s) => s.getSectionHighlightId);

  const fields = useFieldsArray();
  const visibleIds = useMemo(() => {
    const list = isPreview ? fields.filter((f) => checkFieldVisibility(f, fields)) : fields;
    return list.map((f) => f.id);
  }, [isPreview, fields]);

  const clearSel = useCallback(() => selectField(null), [selectField]);
  const select = useCallback((id) => selectField(id), [selectField]);

  const isEmpty = visibleIds.length === 0;

  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-lg overflow-y-auto max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)] custom-scrollbar px-1"
      onClick={() => !isPreview && clearSel()}
    >
      {isEmpty ? (
        <EmptyState />
      ) : (
        visibleIds.map((id) => (
          <FieldRow
            key={id}
            id={id}
            isPreview={isPreview}
            isSelected={selectedFieldId === id}
            select={select}
            clearSelection={clearSel}
            getSectionHighlightId={getSectionHighlightId}
            isEditModalOpen={isEditModalOpen}
            setEditModalOpen={setEditModalOpen}
          />
        ))
      )}
    </div>
  );
}

const FieldRow = React.memo(function FieldRow({
  id,
  isPreview,
  isSelected,
  select,
  clearSelection,
  getSectionHighlightId,
  isEditModalOpen,
  setEditModalOpen,
}) {
  const field = useFormStore(React.useCallback((s) => s.byId[id], [id]));
  const deleteField = useFormStore((s) => s.deleteField);
  if (!field) return null;

  const FieldComponent = fieldTypes[field.fieldType]?.component;
  const label = fieldTypes[field.fieldType]?.label;

  const onDelete = React.useCallback(() => {
    if (isPreview) return;
    deleteField(id);
    if (isSelected) clearSelection?.();
  }, [deleteField, id, isPreview, isSelected, clearSelection]);

  const handleClick = React.useCallback(
    (e) => {
      if (isPreview) return;
      e.stopPropagation?.();
      select?.(id);
    },
    [isPreview, select, id]
  );

  const wrapperClass = [
    "rounded-lg bg-white mb-2",
    isPreview ? "" : "border",
    isSelected ? "border-blue-300 border-2 border-dashed" : "border-gray-200",
  ].join(" ");

  const extraSectionProps =
    field.fieldType === "section" ? { highlightChildId: getSectionHighlightId?.(id) ?? null } : {};

  return (
    <div className={wrapperClass} onClick={handleClick}>
      {FieldComponent ? (
        <FieldComponent
          field={field}
          label={label}
          onDelete={!isPreview ? onDelete : undefined}
          isPreview={isPreview}
          isEditModalOpen={isEditModalOpen}
          setEditModalOpen={setEditModalOpen}
          {...extraSectionProps}
        />
      ) : null}
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
