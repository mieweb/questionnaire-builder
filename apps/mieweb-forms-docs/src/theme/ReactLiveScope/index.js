import React from 'react';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

// Add react-live imports
const ReactLiveScope = {
  React,
  ...React,
  QuestionnaireRenderer,
};

export default ReactLiveScope;
