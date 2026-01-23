/**
 * Transform form response to FHIR QuestionnaireResponse format
 * @param {Array} formResponse - Response array from useFormResponse/extractFormResponse
 * @param {string} questionnaireId - Questionnaire identifier
 * @param {string} [subjectId] - Optional patient/subject ID
 * @returns {Object} FHIR QuestionnaireResponse
 */
export function toFhirQuestionnaireResponse(formResponse, questionnaireId, subjectId) {
  const items = (formResponse || []).map(item => ({
    linkId: item.id,
    text: item.text,
    answer: item.answer.map(a => ({ valueString: a.value }))
  }));

  return {
    resourceType: 'QuestionnaireResponse',
    questionnaire: questionnaireId,
    status: 'in-progress',
    subject: subjectId ? { reference: `Patient/${subjectId}` } : undefined,
    item: items
  };
}
