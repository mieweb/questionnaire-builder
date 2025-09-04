import React from "react";
import { checkFieldVisibility } from "../utils/visibilityChecker";
import { updateField, deleteField } from "../utils/formActions";
import fieldTypes from "../fields/fieldTypes-config";

export function renderFormFields({
  formData = [],
  setFormData,
  isPreview,
  selectedFieldId,
  setSelectedFieldId,
  getSectionHighlightId,
}) {
  return formData.map((field) => {
    const FieldComponent = fieldTypes[field.fieldType]?.component;
    if (!FieldComponent) return null;

    const shouldShow = isPreview ? checkFieldVisibility(field, formData) : true;
    if (!shouldShow) return null;

    const isSelected = selectedFieldId === field.id;

    const onUpdateField = (id, key, value) =>
      updateField(formData, setFormData, id, key, value);

    const onDeleteField = (id) => {
      deleteField(formData, setFormData, id);
      if (selectedFieldId === id) setSelectedFieldId?.(null);
    };

    return (
      <div
        key={field.id}
        className={[
          "rounded-lg bg-white mb-2",
          isPreview ? "" : "border",
          isSelected
            ? "border-blue-300 border-2 border-dashed"
            : "border-gray-200",
        ].join(" ")}
        onClick={(e) => {
          if (isPreview) return;
          e.stopPropagation?.();
          setSelectedFieldId?.(field.id);
        }}
      >
        <FieldComponent
          field={field}
          label={fieldTypes[field.fieldType]?.label}
          onUpdate={(key, value) => onUpdateField(field.id, key, value)}
          onDelete={() => !isPreview && onDeleteField(field.id)}
          isPreview={isPreview}
          formData={formData}
          isSelected={isSelected}
          onSelect={() => !isPreview && setSelectedFieldId?.(field.id)}
          {...(field.fieldType === "section"
            ? { highlightChildId: getSectionHighlightId?.(field.id) || null }
            : {})}
        />
      </div>
    );
  });
}

export default function FormBuilderMain({
  formData = [],
  setFormData,
  isPreview,
  selectedFieldId,
  setSelectedFieldId,
  getSectionHighlightId,
  clearSectionHighlightId
}) {
  const isEmpty = !formData || formData.length === 0;

  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-lg"
      onClick={() => !isPreview && setSelectedFieldId?.(null)}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-72 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-blue-200 rounded-xl shadow-md text-center px-8 py-10">
          <div className="text-xl font-semibold text-gray-700 mb-2">
            Start building your questionnaire
          </div>
          <div className="text-base text-gray-500">
            Add tools with <span className="font-semibold text-blue-500">Tool Panel</span> on the left.<br />
            Select fields to edit on the <span className="font-semibold text-blue-500">Edit Panel</span> on the left.
          </div>
        </div>
      ) : (
        renderFormFields({
          formData,
          setFormData,
          isPreview,
          selectedFieldId,
          setSelectedFieldId,
          getSectionHighlightId,
          clearSectionHighlightId
        })
      )}
    </div>
  );
}
