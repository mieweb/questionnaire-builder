import React from 'react';
import ReactDOM from 'react-dom/client';
import { QuestionnaireRenderer } from './QuestionnaireRenderer.jsx';
import { useFormStore } from '@mieweb/forms-engine';
import { buildQuestionnaireResponse } from './utils/fhirConverter';

class QuestionnaireRendererElement extends HTMLElement {
  static get observedAttributes() {
    return ['fields', 'schema-type', 'full-height', 'hide-unsupported-fields'];
  }

  constructor() {
    super();
    this._root = null;
    this._fields = [];
    this._schemaType = 'inhouse';
    this._hideUnsupportedFields = false;
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

  set schemaType(value) {
    this._schemaType = value || 'inhouse';
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

    let fields = this._fields;
    const fieldsAttr = this.getAttribute('fields');
    if (fieldsAttr && !this._fields.length) {
      try {
        fields = JSON.parse(fieldsAttr);
      } catch {
        fields = [];
      }
    }

    const schemaType = this.getAttribute('schema-type') || this._schemaType || 'inhouse';
    const fullHeight = this.hasAttribute('full-height');
    const hideUnsupportedFields = this.hasAttribute('hide-unsupported-fields') || this._hideUnsupportedFields;
    const className = this.getAttribute('class') || '';

    this._root.render(
      React.createElement(QuestionnaireRenderer, {
        fields,
        schemaType,
        hideUnsupportedFields,
        onChange: this._onChange,
        className,
        fullHeight,
      })
    );
  }
}

if (!customElements.get('questionnaire-renderer')) {
  customElements.define('questionnaire-renderer', QuestionnaireRendererElement);
}

export { QuestionnaireRendererElement };
