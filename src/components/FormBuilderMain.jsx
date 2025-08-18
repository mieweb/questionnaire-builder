import React, { } from "react";
import { checkFieldVisibility } from "../utils/visibilityChecker"
import fieldTypes from "./fields/fieldTypes-config"
import { addField } from "../utils/formActions";

export function renderFormFields({ formData = [], isPreview, setIsPreview, updateField, deleteField }) {
  return formData.map((field) => {
    const FieldComponent = fieldTypes[field.fieldType]?.component;
    const shouldShow = isPreview
      ? checkFieldVisibility(field, formData)
      : true;

    return (
      FieldComponent &&
      shouldShow && (
        <div key={field.id}>
          <FieldComponent
            field={field}
            label={fieldTypes[field.fieldType]?.label}
            onUpdate={(key, value) => updateField(field.id, key, value)}
            onDelete={() => !isPreview && deleteField(field.id)}
            isPreview={isPreview}
            formData={formData}
          />
        </div>
      )
    );
  });
}

export default function FormBuilderMain({ formData, setFormData, isPreview, updateField, deleteField }) {

  if (isPreview) {
    return (
      <div className="FormBuilder-Container w-full max-w-4xl mx-auto pt-8 px-4 pb-20">
        {renderFormFields({ formData, isPreview, updateField, deleteField })}
      </div>
    )
  }

  return (
    <div className="FormBuilder-Container w-full max-w-4xl mx-auto pt-8 px-4 pb-20">
      {renderFormFields({ formData, isPreview, updateField, deleteField })}

      <div className="hidden sm:justify-around sm:flex">
        {Object.keys(fieldTypes).map((type) => (
          <button
            key={type}
            className="px-4 pl-6 py-2 text-black text-left rounded hover:bg-slate-50 invisible sm:visible"
            onClick={() => {
              addField(formData, setFormData, type)
            }}
          >
            Add {fieldTypes[type].label}
          </button>
        ))}
      </div>
      
    </div>
  );
}

