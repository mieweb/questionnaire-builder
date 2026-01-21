import React from 'react';
import ReactDOM from 'react-dom/client';
import { QuestionnaireRenderer } from './QuestionnaireRenderer.jsx';

export function registerBlazeTemplate() {
  if (typeof Template === 'undefined') {
    console.error('Blaze Template not found. Make sure this runs in a Meteor environment.');
    return;
  }

  Template.questionnaireRenderer = new Blaze.Template('Template.questionnaireRenderer', function() {
    return HTML.DIV({ class: 'questionnaire-renderer-mount' });
  });

  Template.questionnaireRenderer.onRendered(function() {
    const templateInstance = this;
    const mountNode = templateInstance.find('.questionnaire-renderer-mount');
    
    if (!mountNode) {
      console.error('Mount node not found');
      return;
    }

    const root = ReactDOM.createRoot(mountNode);

    templateInstance.autorun(() => {
      // Use Template.currentData() for reactive data
      const data = Template.currentData() || {};
      const props = {
        formData: data.formData || [],
        schemaType: data.schemaType,
        hideUnsupportedFields: data.hideUnsupportedFields,
        onChange: data.onChange,
        onQuestionnaireResponse: data.onQuestionnaireResponse,
        questionnaireId: data.questionnaireId,
        subjectId: data.subjectId,
        onSubmit: data.onSubmit,
        fullHeight: data.fullHeight,
        className: data.className,
        theme: data.theme || 'light'
      };
      root.render(React.createElement(QuestionnaireRenderer, props));
    });

    templateInstance.view.onViewDestroyed(() => {
      root.unmount();
    });
  });
}

if (typeof Meteor !== 'undefined') {
  registerBlazeTemplate();
}
