// React component export (requires React peer dependencies)
export { QuestionnaireRenderer } from './src/QuestionnaireRenderer.jsx';

// Components (optional - for custom layouts)
export { RendererBody, FieldNode } from './src/components';

// Utilities for building FHIR responses
export { toFhirQuestionnaireResponse } from './src/utils/fhirResponse';

// Re-export useful hooks/functions from forms-engine for convenience
export { useFieldsArray, useFormResponse, useFormData } from '@mieweb/forms-engine';
