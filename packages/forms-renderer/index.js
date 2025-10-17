// React component export (requires React peer dependencies)
export { QuestionnaireRenderer } from './src/QuestionnaireRenderer.jsx';

// Components (optional - for custom layouts)
export { RendererBody, FieldNode } from './src/components';

// Utilities for building FHIR responses
export { buildQuestionnaireResponse } from './src/utils/fhirConverter';

// Re-export useful hook from forms-engine for convenience
export { useFieldsArray } from '@mieweb/forms-engine';
