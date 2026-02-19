import React from 'react';
import { FormStoreContext, UIStoreContext, createFormStore, createUIStore, useFormResponse } from '@mieweb/forms-engine';
import { useQuestionnaireInit } from './hooks';
import { RendererBody } from './components';
import './index.css';

/**
 * QuestionnaireRenderer - Read-only questionnaire form renderer
 * @param {string|object} formData - YAML string, JSON string, or form data object
 * @param {string} [schemaType] - Optional: 'mieforms' or 'surveyjs' (auto-detected if not provided)
 * @param {string} [className] - Additional CSS classes
 * @param {boolean} [hideUnsupportedFields=true] - Hide unsupported field types
 * @param {'light'|'dark'} [theme='light'] - Theme: 'light' or 'dark'
 * @param {React.Ref} [ref] - Ref exposing getResponse() method (returns MIE Forms response schema)
 */
export const QuestionnaireRenderer = React.forwardRef((props, ref) => {
  const formStore = React.useMemo(() => createFormStore(), []);
  const uiStore = React.useMemo(() => createUIStore(), []);

  return (
    <FormStoreContext.Provider value={formStore}>
      <UIStoreContext.Provider value={uiStore}>
        <QuestionnaireRendererInner {...props} ref={ref} />
      </UIStoreContext.Provider>
    </FormStoreContext.Provider>
  );
});
QuestionnaireRenderer.displayName = 'QuestionnaireRenderer';

const QuestionnaireRendererInner = React.forwardRef(({
  formData,
  schemaType,
  className = '',
  hideUnsupportedFields = true,
  theme = 'light',
}, ref) => {
  const isDark = theme === 'dark';
  const response = useFormResponse();
  
  React.useImperativeHandle(ref, () => ({
    getResponse: () => response,
  }), [response]);
  
  const rootClasses = [
    isDark && 'dark',
    'qb-renderer-root renderer-container mie:font-titillium mie:overflow-y-auto mie:custom-scrollbar',
    'mie:max-w-4xl mie:mx-auto mie:px-2 mie:pb-8 mie:pt-4',
    className,
  ].filter(Boolean).join(' ');
  
  useQuestionnaireInit(formData, schemaType, hideUnsupportedFields);

  return (
    <div className={rootClasses}>
      <RendererBody />
    </div>
  );
});
QuestionnaireRendererInner.displayName = 'QuestionnaireRendererInner';
