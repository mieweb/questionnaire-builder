import React, { useMemo, useState } from "react";
import { fieldTypes } from "@questionnaire-builder/fields";

export default function FormRenderer({ 
  hooks,
  isVisible,
  onSubmit, 
  showSubmitButton = true,
  submitButtonText = "Submit"
}) {
  const [validationErrors, setValidationErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
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

  const validateRequiredFields = () => {
    const errors = {};
    const allFields = hooks.useFormStore.getState().flatArray();
    
    allFields.forEach(field => {
      // Skip section fields and non-required fields
      if (field.fieldType === 'section' || !field.required) return;
      
      let isEmpty = false;
      
      // Check if field is empty based on field type
      if (field.fieldType === 'input') {
        isEmpty = !field.answer || field.answer.trim() === '';
      } else if (['radio', 'selection'].includes(field.fieldType)) {
        isEmpty = !field.selected;
      } else if (field.fieldType === 'check') {
        isEmpty = !Array.isArray(field.selected) || field.selected.length === 0;
      } else {
        // Fallback validation
        isEmpty = !field.answer && !field.selected;
      }
      
      if (isEmpty) {
        errors[field.id] = `${field.question || 'This field'} is required`;
      }
    });
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    const errors = validateRequiredFields();
    setValidationErrors(errors);
    
    // If there are validation errors, don't submit
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      // Scroll to first error
      const firstErrorField = document.querySelector(`[data-field-id="${Object.keys(errors)[0]}"]`);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    if (onSubmit) {
      try {
        // Collect form data from all fields including nested section fields
        const formData = {};
        const allFields = hooks.useFormStore.getState().flatArray();
        
        allFields.forEach(field => {
          // Skip section fields themselves, only collect actual input fields
          if (field.fieldType === 'section') return;
          
          let fieldValue = null;
          
          // Get the appropriate value based on field type
          if (field.fieldType === 'input') {
            fieldValue = field.answer || '';
          } else if (['radio', 'selection'].includes(field.fieldType)) {
            // For single selection fields, get the selected option value
            if (field.selected && field.options) {
              const selectedOption = field.options.find(opt => opt.id === field.selected);
              fieldValue = selectedOption ? selectedOption.value : field.selected;
            } else {
              fieldValue = field.selected || '';
            }
          } else if (field.fieldType === 'check') {
            // For multi-selection fields, get array of selected option values
            if (Array.isArray(field.selected) && field.options) {
              fieldValue = field.selected.map(selectedId => {
                const option = field.options.find(opt => opt.id === selectedId);
                return option ? option.value : selectedId;
              });
            } else {
              fieldValue = field.selected || [];
            }
          } else {
            // Fallback for other field types
            fieldValue = field.answer || field.selected || '';
          }
          
          formData[field.id] = {
            question: field.question,
            answer: fieldValue,
            fieldType: field.fieldType,
            required: field.required || false
          };
        });
        
        console.log('Form Data Submitted:', formData);
        await onSubmit(formData);
        
        // Clear validation errors on successful submission
        setValidationErrors({});
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto rounded-lg overflow-y-auto max-h-[calc(100svh-19rem)] lg:max-h-[calc(100dvh-15rem)] custom-scrollbar pr-2">
      {/* Show validation summary if there are errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.values(validationErrors).map((error, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {visibleIds.length === 0
        ? <EmptyFormState />
        : visibleIds.map((id) => (
          <div key={id} data-field-id={id}>
            <FieldRow id={id} hooks={previewHooks} validationError={validationErrors[id]} />
          </div>
        ))}
      
      {showSubmitButton && visibleIds.length > 0 && (
        <div className="mt-6 text-center">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
        </div>
      )}
    </form>
  );
}

const FieldRow = React.memo(function FieldRow({ id, hooks, validationError }) {
  const field = hooks.useFormStore(React.useCallback((s) => s.byId[id], [id]));
  if (!field) return null;

  const FieldComponent = fieldTypes[field.fieldType]?.component;
  return (
    <div className={`mb-1.5 ${validationError ? 'pb-2' : ''}`}>
      {FieldComponent ? <FieldComponent field={field} hooks={hooks} /> : null}
      {validationError && (
        <div className="mt-1 text-sm text-red-600 flex items-center">
          <span className="w-4 h-4 mr-1">⚠️</span>
          {validationError}
        </div>
      )}
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