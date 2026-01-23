import React from 'react';
import ReactDOM from 'react-dom/client';
import { QuestionnaireRenderer } from './QuestionnaireRenderer.jsx';

class QuestionnaireRendererElement extends HTMLElement {
  static observedAttributes = ['form-data', 'schema-type', 'full-height', 'hide-unsupported-fields', 'theme'];

  constructor() {
    super();
    this._root = null;
    this._rendererRef = React.createRef();
    this._formData = [];
    this._schemaType = undefined;
    this._hideUnsupportedFields = true;
    this._theme = 'light';
  }

  getResponse() {
    return this._rendererRef.current?.getResponse?.() ?? null;
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
        ref: this._rendererRef,
        formData,
        schemaType: this.getAttribute('schema-type') || this._schemaType || undefined,
        hideUnsupportedFields: this.hasAttribute('hide-unsupported-fields') || this._hideUnsupportedFields,
        className: this.getAttribute('class') || '',
        theme: this.getAttribute('theme') || this._theme || 'light',
      })
    );
  }
}

if (!customElements.get('questionnaire-renderer')) {
  customElements.define('questionnaire-renderer', QuestionnaireRendererElement);
}

export { QuestionnaireRendererElement };
