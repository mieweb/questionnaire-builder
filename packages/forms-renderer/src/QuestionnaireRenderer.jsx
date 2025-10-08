import React from 'react';
import { useFormStore } from '@mieweb/forms-engine';
import { useQuestionnaireInit } from './hooks';
import { RendererBody } from './components';

/**
 * QuestionnaireRenderer
 * Read-only / answer capture rendering (no editing tools) for a questionnaire definition (fields array)
 * 
 * Note: This component does not include a submit button or form wrapper.
 * Use `useQuestionnaireData()` hook to get current data and handle submission yourself.
 */
export function QuestionnaireRenderer({
  fields,
  onChange,
  className = '',
  fullHeight = false,
}) {
  // Initialize questionnaire and set preview mode
  useQuestionnaireInit(fields);

  // Subscribe to form changes
  React.useEffect(() => {
    if (!onChange) return;
    const unsub = useFormStore.subscribe((s) => {
      // Return non-flattened array (sections contain nested fields)
      const arr = s.order.map(id => s.byId[id]);
      onChange(arr);
    });
    return unsub;
  }, [onChange]);

  const rootClasses = [
    'qb-render-root',
    'bg-gray-100',
    'font-titillium',
    fullHeight ? 'min-h-screen' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      <div className="max-w-4xl mx-auto px-2 pb-8 pt-4">
        <RendererBody />
      </div>
    </div>
  );
}
