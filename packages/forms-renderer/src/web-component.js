import React from 'react';
import ReactDOM from 'react-dom/client';
import { QuestionnaireRenderer } from './QuestionnaireRenderer.jsx';

/**
 * QuestionnaireRendererElement
 * Web Component wrapper for QuestionnaireRenderer React component
 * Converts props to attributes and provides framework-agnostic interface
 */
class QuestionnaireRendererElement extends HTMLElement {
  static get observedAttributes() {
    return ['fields', 'questionnaire-id', 'subject-id', 'full-height'];
  }

  constructor() {
    super();
    this._root = null;
    this._fields = [];
    this._onChange = null;
    this._onSubmit = null;
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

  set onSubmit(fn) {
    this._onSubmit = fn;
    this._render();
  }

  get onSubmit() {
    return this._onSubmit;
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
    const questionnaireId = this.getAttribute('questionnaire-id') || 'questionnaire-1';
    const subjectId = this.getAttribute('subject-id') || undefined;
    const fullHeight = this.hasAttribute('full-height');
    const className = this.getAttribute('class') || '';

    this._root.render(
      React.createElement(QuestionnaireRenderer, {
        fields,
        onChange: this._onChange,
        onSubmit: this._onSubmit,
        questionnaireId,
        subjectId,
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
