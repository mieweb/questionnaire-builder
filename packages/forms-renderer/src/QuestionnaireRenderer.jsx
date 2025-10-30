import React from 'react';
import { useFormStore } from '@mieweb/forms-engine';
import { useQuestionnaireInit } from './hooks';
import { RendererBody } from './components';
import './styles.input.css';

/**
 * QuestionnaireRenderer - Read-only questionnaire form renderer
 * @param {string|object} formData - YAML string, JSON string, or form data object
 * @param {string} [schemaType] - Optional: 'mieforms' or 'surveyjs' (auto-detected if not provided)
 * @param {function} [onChange] - Callback fired when form data changes
 * @param {string} [className] - Additional CSS classes
 * @param {boolean} [fullHeight=false] - Apply min-h-screen
 * @param {boolean} [hideUnsupportedFields=true] - Hide unsupported field types
 */
export function QuestionnaireRenderer({
  formData,
  schemaType,
  onChange,
  className = '',
  fullHeight = false,
  hideUnsupportedFields = true,
}) {
  useQuestionnaireInit(formData, schemaType, hideUnsupportedFields);

  React.useEffect(() => {
    if (!onChange) return;
    return useFormStore.subscribe((s) => {
      onChange({
        schemaType: s.schemaType || 'mieforms-v1.0',
        ...s.schemaMetadata,
        fields: s.order.map(id => s.byId[id])
      });
    });
  }, [onChange]);

  const rootClasses = [
    'qb-render-root font-titillium overflow-y-auto custom-scrollbar',
    'max-w-4xl mx-auto px-2 pb-8 pt-4',
    fullHeight && 'max-h-screen my-9',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      <RendererBody />
    </div>
  );
}
