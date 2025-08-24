import React from "react";
import { checkFieldVisibility } from "../utils/visibilityChecker";
import fieldTypes from "../fields/fieldTypes-config";

export function renderFormFields({
  formData = [],
  isPreview,
  updateField,
  deleteField,
  onSelectField,
  selectedFieldId }) {
  return formData.map((field) => {
    const FieldComponent = fieldTypes[field.fieldType]?.component;
    const shouldShow = isPreview ? checkFieldVisibility(field, formData) : true;

    const isSelected = selectedFieldId === field.id;

    return (
      FieldComponent &&
      shouldShow && (
        <div
          key={field.id}
          className={`rounded-lg mb-2  ${isPreview ? "mb-0" : "border"} ${isSelected ? "border-blue-500 ring-1 ring-blue-400" : "border-transparent"}`}
          onClick={(e) => {
            e.stopPropagation?.();
            onSelectField?.(field.id);
          }}
        >
          <FieldComponent
            field={field}
            label={fieldTypes[field.fieldType]?.label}
            onUpdate={(key, value) => updateField(field.id, key, value)}
            onDelete={() => !isPreview && deleteField(field.id)}
            isPreview={isPreview}
            formData={formData}
            isSelected={isSelected}
            onSelect={() => onSelectField?.(field.id)}
          />
        </div>
      )
    );
  });
}

export default function FormBuilderMain({
  formData,
  //setFormData, [ passed down from App.jsx, used for adding fields ]
  isPreview,
  updateField,
  deleteField,
  onSelectField,
  selectedFieldId,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto" onClick={() => onSelectField?.(null)}>
      {renderFormFields({ formData, isPreview, updateField, deleteField, onSelectField, selectedFieldId })}
    </div>
  );
}
