import React from 'react';
import { useFormStore } from '@mieweb/forms-engine';
import { useQuestionnaireInit } from './hooks';
import { RendererBody } from './components';
import './styles.input.css';

export function QuestionnaireRenderer({
  fields,
  schemaType = 'inhouse',
  onChange,
  className = '',
  fullHeight = false,
  hideUnsupportedFields = false,
}) {
  useQuestionnaireInit(fields, schemaType, hideUnsupportedFields);

  React.useEffect(() => {
    if (!onChange) return;
    const unsub = useFormStore.subscribe((s) => {
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
