import { useFieldsArray } from '@mieweb/forms-engine';
import { buildQuestionnaireResponse } from '../utils/fhirConverter';

/**
 * Hook to get current questionnaire data
 * Use this to handle submission yourself
 * 
 * @param {string} questionnaireId - ID for the questionnaire
 * @param {string} subjectId - ID for the subject (patient, etc.)
 * @returns {Object} { fields, getQuestionnaireResponse }
 * 
 * @example
 * const { fields, getQuestionnaireResponse } = useQuestionnaireData('q-1', 'patient-123');
 * 
 * const handleSubmit = (e) => {
 *   e.preventDefault();
 *   const fhirResponse = getQuestionnaireResponse();
 *   console.log('FHIR Response:', fhirResponse);
 * };
 */
export function useQuestionnaireData(questionnaireId = 'questionnaire-1', subjectId) {
  const fields = useFieldsArray();
  
  const getQuestionnaireResponse = () => {
    return buildQuestionnaireResponse(fields, questionnaireId, subjectId);
  };
  
  return {
    fields,
    getQuestionnaireResponse
  };
}
