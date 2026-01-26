# Quick Start: Renderer

Get started with `@mieweb/forms-renderer` to display questionnaires in your app.

## Basic React Example

```jsx
import React, { useRef } from 'react';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function MyForm() {
  const rendererRef = useRef();
  
  const formData = {
    schemaType: 'mieforms-v1.0',
    title: 'Patient Survey',
    fields: [
      {
        id: 'name',
        fieldType: 'text',
        question: 'What is your full name?',
        required: true
      },
      {
        id: 'age',
        fieldType: 'text',
        question: 'What is your age?',
        inputType: 'number'
      },
      {
        id: 'gender',
        fieldType: 'radio',
        question: 'Gender',
        options: [
          { value: 'Male' },
          { value: 'Female' },
          { value: 'Other' }
        ]
      }
    ]
  };

  const handleSubmit = () => {
    const response = rendererRef.current.getResponse();
    console.log('Form submitted!', response);
  };

  return (
    <div>
      <QuestionnaireRenderer ref={rendererRef} formData={formData} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default MyForm;
```

## Get Response

Use the `ref` prop to get form responses on demand:

```jsx
import React, { useRef } from 'react';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function MyForm() {
  const rendererRef = useRef();
  
  const formData = {
    schemaType: 'mieforms-v1.0',
    fields: [
      { id: 'q1', fieldType: 'text', question: 'Name?' }
    ]
  };

  const handleSubmit = () => {
    const response = rendererRef.current.getResponse();
    console.log('Submitting response:', response);
    // Send response to your server
  };

  return (
    <div>
      <QuestionnaireRenderer ref={rendererRef} formData={formData} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default MyForm;
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
- [Get Response](/docs/renderer/get-response)
- [Field Types](/docs/field-types)
- [Forms Renderer README](https://github.com/mieweb/questionnaire-builder/tree/main/packages/forms-renderer/README.md)
