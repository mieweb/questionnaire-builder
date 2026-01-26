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
    const rendererRef = React.createRef();
    
    templateInstance.getResponse = () => rendererRef.current?.getResponse?.() ?? null;

    templateInstance.autorun(() => {
      const data = Template.currentData() || {};
      const props = {
        ref: rendererRef,
        formData: data.formData || [],
        schemaType: data.schemaType,
        hideUnsupportedFields: data.hideUnsupportedFields,
        className: data.className,
        theme: data.theme || 'light',
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
