import React from 'react';
import ReactDOM from 'react-dom/client';
import { QuestionnaireRenderer } from './QuestionnaireRenderer.jsx';
import { useFormStore } from '@mieweb/forms-engine';
import { buildQuestionnaireResponse } from './utils/fhirConverter';

/**
 * QuestionnaireRendererElement
 * Web Component wrapper for QuestionnaireRenderer React component
 * Converts props to attributes and provides framework-agnostic interface
 * 
 * Note: Does not include submit button. Wrap in a form and add your own submit button.
 * Use the getQuestionnaireResponse() method to get FHIR response data.
 */
class QuestionnaireRendererElement extends HTMLElement {
  static get observedAttributes() {
    return ['fields', 'full-height'];
  }

  constructor() {
    super();
    this._root = null;
    this._fields = [];
    this._onChange = null;
  }

  connectedCallback() {
    this._mount();
  }

  disconnectedCallback() {
    this._unmount();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render();
    }
  }

  // Property setters for imperative API
  set fields(value) {
    this._fields = value;
    this._render();
  }

  get fields() {
    return this._fields;
  }

  set onChange(fn) {
    this._onChange = fn;
    this._render();
  }

  get onChange() {
    return this._onChange;
  }

  /**
   * Get FHIR QuestionnaireResponse from current form data
   * @param {string} questionnaireId - ID for the questionnaire
   * @param {string} subjectId - Optional subject/patient ID
   * @returns {Object} FHIR QuestionnaireResponse
   */
  getQuestionnaireResponse(questionnaireId = 'questionnaire-1', subjectId) {
    const state = useFormStore.getState();
    const fields = state.order.map(id => state.byId[id]);
    return buildQuestionnaireResponse(fields, questionnaireId, subjectId);
  }

  _mount() {
    if (!this._root) {
      this._root = ReactDOM.createRoot(this);
    }
    this._render();
  }

  _unmount() {
    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }

  _render() {
    if (!this._root) return;

    // Parse fields from attribute or use property
    let fields = this._fields;
    const fieldsAttr = this.getAttribute('fields');
    if (fieldsAttr && !this._fields.length) {
      try {
        fields = JSON.parse(fieldsAttr);
      } catch (e) {
        console.error('Invalid fields JSON:', e);
        fields = [];
      }
    }

    // Parse other attributes
    const fullHeight = this.hasAttribute('full-height');
    const className = this.getAttribute('class') || '';

    this._root.render(
      React.createElement(QuestionnaireRenderer, {
        fields,
        onChange: this._onChange,
        className,
        fullHeight,
      })
    );
  }
}

// Auto-register if not already defined
if (!customElements.get('questionnaire-renderer')) {
  customElements.define('questionnaire-renderer', QuestionnaireRendererElement);
}

export { QuestionnaireRendererElement };
