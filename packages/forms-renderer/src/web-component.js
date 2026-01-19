import React from 'react';
import ReactDOM from 'react-dom/client';
import { QuestionnaireRenderer } from './QuestionnaireRenderer.jsx';
import { buildQuestionnaireResponse } from './utils/fhirResponse';

class QuestionnaireRendererElement extends HTMLElement {
  static observedAttributes = ['form-data', 'schema-type', 'full-height', 'hide-unsupported-fields', 'theme'];

  constructor() {
    super();
    this._root = null;
    this._formData = [];
    this._schemaType = undefined;
    this._hideUnsupportedFields = true;
    this._theme = 'auto';
    this._onChange = null;
    this._storeRef = React.createRef(); // Store reference for accessing state
  }

  connectedCallback() {
    this._mount();
  }

  disconnectedCallback() {
    this._unmount();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this._render();
  }

  set formData(value) {
    this._formData = value;
    this._render();
  }

  get formData() {
    return this._formData;
  }

  set onChange(fn) {
    this._onChange = fn;
    this._render();
  }

  set schemaType(value) {
    this._schemaType = value;
    this._render();
  }

  get schemaType() {
    return this._schemaType;
  }

  set hideUnsupportedFields(value) {
    this._hideUnsupportedFields = Boolean(value);
    this._render();
  }

  get hideUnsupportedFields() {
    return this._hideUnsupportedFields;
  }

  set theme(value) {
    this._theme = value;
    this._render();
  }

  get theme() {
    return this._theme;
  }

  getQuestionnaireResponse(questionnaireId = 'questionnaire-1', subjectId) {
    if (!this._storeRef.current) {
      console.warn('Store not initialized yet');
      return null;
    }
    const state = this._storeRef.current.getState();
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

    let formData = this._formData;
    const formDataAttr = this.getAttribute('form-data');
    if (formDataAttr && !this._formData.length) {
      try {
        formData = JSON.parse(formDataAttr);
      } catch {
        formData = [];
      }
    }

    this._root.render(
      React.createElement(QuestionnaireRenderer, {
        formData,
        schemaType: this.getAttribute('schema-type') || this._schemaType || undefined,
        hideUnsupportedFields: this.hasAttribute('hide-unsupported-fields') || this._hideUnsupportedFields,
        onChange: this._onChange,
        className: this.getAttribute('class') || '',
        fullHeight: this.hasAttribute('full-height'),
        theme: this.getAttribute('theme') || this._theme || 'auto',
        storeRef: this._storeRef,
      })
    );
  }
}

if (!customElements.get('questionnaire-renderer')) {
  customElements.define('questionnaire-renderer', QuestionnaireRendererElement);
}

export { QuestionnaireRendererElement };
