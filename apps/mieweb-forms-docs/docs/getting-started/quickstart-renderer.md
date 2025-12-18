# Quick Start: Renderer

Get started with `@mieweb/forms-renderer` to display questionnaires in your app.

## Basic React Example

```jsx
import React from 'react';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function MyForm() {
  const [formData] = React.useState({
    schemaType: 'mieforms-v1.0',
    title: 'Patient Survey',
    fields: [
      {
        id: 'name',
        fieldType: 'text',
        question: 'What is your full name?',
        required: true,
        answer: ''
      },
      {
        id: 'age',
        fieldType: 'text',
        question: 'What is your age?',
        answer: ''
      },
      {
        id: 'gender',
        fieldType: 'radio',
        question: 'Gender',
        options: [
          { value: 'Male' },
          { value: 'Female' },
          { value: 'Other' }
        ],
        selected: null
      }
    ]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted!', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer formData={formData} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
```

## With FHIR Export

Export filled forms as FHIR QuestionnaireResponse:

```jsx
import React from 'react';
import { 
  QuestionnaireRenderer, 
  buildQuestionnaireResponse
} from '@mieweb/forms-renderer';

function MyForm() {
  const [formData] = React.useState({
    schemaType: 'mieforms-v1.0',
    fields: [
      { id: 'q1', fieldType: 'text', question: 'Name?', answer: '' }
    ]
  });

  const storeRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const state = storeRef.current?.getState?.();
    if (!state) return;
    const currentFields = state.order.map((id) => state.byId[id]);
    const fhirResponse = buildQuestionnaireResponse(
      currentFields,
      'my-questionnaire-id',
      'patient-123'
    );
    console.log('FHIR Response:', fhirResponse);
    // Send to your FHIR server
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer formData={formData} storeRef={storeRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Loading from YAML

You can pass YAML strings directly:

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

const yamlData = `
schemaType: mieforms-v1.0
title: Patient Intake
fields:
  - id: name
    fieldType: text
    question: What is your name?
    answer: ''
`;

function MyForm() {
  return <QuestionnaireRenderer formData={yamlData} />;
}
```

## Styling

Add custom CSS classes:

```jsx
<QuestionnaireRenderer 
  formData={formData}
  className="my-custom-form p-4 bg-gray-50"
/>
```

The renderer uses Tailwind CSS internally, so Tailwind utility classes work out of the box.

## Next Steps

- [Renderer Overview](/docs/renderer/overview)
- [Renderer Props](/docs/renderer/props)
- [FHIR Export](/docs/renderer/fhir-export)
- [Field Types](/docs/field-types)
- [Forms Renderer README](https://github.com/mieweb/questionnaire-builder/tree/main/packages/forms-renderer/README.md)
