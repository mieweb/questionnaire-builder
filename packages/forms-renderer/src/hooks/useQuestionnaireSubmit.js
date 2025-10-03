import React from 'react';
import { buildQuestionnaireResponse } from '../utils/fhirConverter';

export function useQuestionnaireSubmit(fields, questionnaireId, subjectId, onSubmit) {
  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    const qr = buildQuestionnaireResponse(fields, questionnaireId, subjectId);
    onSubmit?.(qr);
  }, [fields, questionnaireId, subjectId, onSubmit]);

  return handleSubmit;
}
