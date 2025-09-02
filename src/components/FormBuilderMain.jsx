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
            ? "border-blue-500 ring-2 ring-blue-300"
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
  getSectionHighlightId
}) {
  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-lg"
      onClick={() => !isPreview && setSelectedFieldId?.(null)}
    >
      {renderFormFields({
        formData,
        setFormData,
        isPreview,
        selectedFieldId,
        setSelectedFieldId,
        getSectionHighlightId
      })}
    </div>
  );
}
