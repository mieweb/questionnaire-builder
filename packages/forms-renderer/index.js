// React component export (requires React peer dependencies)
export { QuestionnaireRenderer } from './src/QuestionnaireRenderer.jsx';

// Hooks for handling submission
export { useQuestionnaireData, useQuestionnaireSubmit } from './src/hooks';

// Components (optional - for custom layouts)
export { RendererBody, FieldNode } from './src/components';

// Utilities
export { buildQuestionnaireResponse } from './src/utils/fhirConverter';
