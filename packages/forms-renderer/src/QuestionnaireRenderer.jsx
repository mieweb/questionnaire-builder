import React from 'react';
import { FormStoreContext, UIStoreContext, createFormStore, createUIStore } from '@mieweb/forms-engine';
import { useQuestionnaireInit } from './hooks';
import { RendererBody } from './components';
import { buildQuestionnaireResponse } from './utils/fhirResponse';
import './styles.input.css';

/**
 * QuestionnaireRenderer - Read-only questionnaire form renderer
 * @param {string|object} formData - YAML string, JSON string, or form data object
 * @param {string} [schemaType] - Optional: 'mieforms' or 'surveyjs' (auto-detected if not provided)
 * @param {function} [onChange] - Callback fired when form data changes
 * @param {function} [onQuestionnaireResponse] - Callback fired when answers change (receives FHIR QuestionnaireResponse)
 * @param {string} [questionnaireId] - Questionnaire identifier used in QuestionnaireResponse
 * @param {string} [subjectId] - Optional subject id used in QuestionnaireResponse (Patient/{subjectId})
 * @param {string} [className] - Additional CSS classes
 * @param {boolean} [fullHeight=false] - Apply min-h-screen
 * @param {boolean} [hideUnsupportedFields=true] - Hide unsupported field types
 * @param {React.MutableRefObject} [storeRef] - Optional ref to access the store instance
 */
function QuestionnaireRendererInner({
  formData,
  schemaType,
  onChange,
  onQuestionnaireResponse,
  questionnaireId = 'questionnaire-1',
  subjectId,
  className = '',
  fullHeight = false,
  hideUnsupportedFields = true,
  storeRef,
}) {
  const formStore = React.useContext(FormStoreContext);
  
  // Expose store to parent via ref
  React.useEffect(() => {
    if (storeRef && formStore) {
      storeRef.current = formStore;
    }
  }, [storeRef, formStore]);
  
  useQuestionnaireInit(formData, schemaType, hideUnsupportedFields);

  React.useEffect(() => {
    if ((!onChange && !onQuestionnaireResponse) || !formStore) return;
    return formStore.subscribe((s) => {
      const fields = s.order.map((id) => s.byId[id]);

      if (onChange) {
        onChange({
          schemaType: s.schemaType || 'mieforms-v1.0',
          ...s.schemaMetadata,
          fields,
        });
      }

      if (onQuestionnaireResponse) {
        onQuestionnaireResponse(buildQuestionnaireResponse(fields, questionnaireId, subjectId));
      }
    });
  }, [onChange, onQuestionnaireResponse, questionnaireId, subjectId, formStore]);

  const rootClasses = [
    'qb-render-root renderer-container font-titillium overflow-y-auto custom-scrollbar',
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

export function QuestionnaireRenderer(props) {
  const formStore = React.useRef(createFormStore()).current;
  const uiStore = React.useRef(createUIStore()).current;

  return (
    <FormStoreContext.Provider value={formStore}>
      <UIStoreContext.Provider value={uiStore}>
        <QuestionnaireRendererInner {...props} />
      </UIStoreContext.Provider>
    </FormStoreContext.Provider>
  );
}
