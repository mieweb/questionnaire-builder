import React from 'react';
import { useFormStore, useFieldsArray } from '@mieweb/forms-engine';
import { useQuestionnaireInit, useQuestionnaireSubmit } from './hooks';
import { RendererBody, SubmitButton } from './components';

/**
 * QuestionnaireRenderer
 * Read-only / answer capture rendering (no editing tools) for a questionnaire definition (fields array)
 */
export function QuestionnaireRenderer({
  fields,
  onChange,
  onSubmit,
  questionnaireId = 'questionnaire-1',
  subjectId,
  className = '',
  fullHeight = false,
}) {
  // Initialize questionnaire and set preview mode
  useQuestionnaireInit(fields);

  // Subscribe to form changes
  React.useEffect(() => {
    if (!onChange) return;
    const unsub = useFormStore.subscribe((s) => {
      const arr = s.flatArray ? s.flatArray() : Object.values(s.byId);
      onChange(arr);
    });
    return unsub;
  }, [onChange]);

  // Get current fields for submission
  const all = useFieldsArray();

  // Handle form submission
  const handleSubmit = useQuestionnaireSubmit(all, questionnaireId, subjectId, onSubmit);

  // Build root CSS classes
  const rootClasses = [
    'qb-render-root',
    'bg-gray-100',
    'font-titillium',
    fullHeight ? 'min-h-screen' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-2 pb-8 pt-4">
        <RendererBody />
        <SubmitButton />
      </form>
    </div>
  );
}
