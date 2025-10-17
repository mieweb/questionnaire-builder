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
    const render = () => {
      const props = {
        fields: templateInstance.data.fields || [],
        schemaType: templateInstance.data.schemaType || 'inhouse',
        hideUnsupportedFields: templateInstance.data.hideUnsupportedFields || false,
        onChange: templateInstance.data.onChange,
        onSubmit: templateInstance.data.onSubmit,
        fullHeight: templateInstance.data.fullHeight,
        className: templateInstance.data.className
      };
      
      root.render(React.createElement(QuestionnaireRenderer, props));
    };

    if (typeof Tracker !== 'undefined') {
      templateInstance.autorun(() => {
        render();
      });
    } else {
      render();
    }

    templateInstance.view.onViewDestroyed(() => {
      root.unmount();
    });
  });
}

if (typeof Meteor !== 'undefined') {
  registerBlazeTemplate();
}
