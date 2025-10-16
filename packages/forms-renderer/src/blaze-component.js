/**
 * Blaze Component for QuestionnaireRenderer
 * Bundles React internally so Meteor apps don't need React dependency
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QuestionnaireRenderer } from './QuestionnaireRenderer.jsx';

/**
 * Register Blaze template: questionnaireRenderer
 * 
 * Usage in Meteor/Blaze:
 * {{> questionnaireRenderer fields=myFields onChange=handleChange}}
 */
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

    // Create React root
    const root = ReactDOM.createRoot(mountNode);
    
    // Render function that reads reactive data
    const render = () => {
      const props = {
        fields: templateInstance.data.fields || [],
        schemaType: templateInstance.data.schemaType || 'inhouse',
        onChange: templateInstance.data.onChange,
        onSubmit: templateInstance.data.onSubmit,
        fullHeight: templateInstance.data.fullHeight,
        className: templateInstance.data.className
      };
      
      root.render(React.createElement(QuestionnaireRenderer, props));
    };

    // Set up reactive rendering with Tracker
    if (typeof Tracker !== 'undefined') {
      templateInstance.autorun(() => {
        render();
      });
    } else {
      render();
    }

    // Clean up on destroy
    templateInstance.view.onViewDestroyed(() => {
      root.unmount();
    });
  });
}

// Auto-register if in Meteor environment
if (typeof Meteor !== 'undefined') {
  registerBlazeTemplate();
}
