# Quick Start: Editor

Get started with `@mieweb/forms-editor` to build form creation tools.

## Basic Example

```jsx
import React from 'react';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function FormBuilder() {
  const handleChange = (updatedFormData) => {
    console.log('Form updated:', updatedFormData);
  };

  return (
    <QuestionnaireEditor 
      onChange={handleChange}
    />
  );
}

export default FormBuilder;
```

## With Initial Fields

Start with pre-populated fields:

```jsx
import React from 'react';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function FormBuilder() {
  const [formData, setFormData] = React.useState({
    schemaType: 'mieforms-v1.0',
    title: 'Patient Intake Form',
    description: 'Collect basic patient information',
    fields: [
      {
        id: 'section-demographics',
        fieldType: 'section',
        title: 'Demographics',
        fields: [
          {
            id: 'name',
            fieldType: 'text',
            question: 'Full Name',
            required: true
          },
          {
            id: 'dob',
            fieldType: 'text',
            question: 'Date of Birth',
            required: true
          }
        ]
      }
    ]
  });

  return (
    <QuestionnaireEditor 
      initialFormData={formData}
      onChange={setFormData}
    />
  );
}
```

## Start in Preview Mode

Launch the editor in preview mode:

```jsx
<QuestionnaireEditor 
  initialFormData={formData}
  onChange={setFormData}
  startInPreview={true}
/>
```

## Hide Unsupported Fields

Filter out experimental or unsupported field types:

```jsx
<QuestionnaireEditor 
  initialFormData={formData}
  onChange={setFormData}
  hideUnsupportedFields={true}
/>
```

## Import from YAML

The editor automatically parses YAML or JSON strings:

```jsx
const yamlString = `
schemaType: mieforms-v1.0
title: Survey
fields:
  - id: q1
    fieldType: text
    question: Your feedback?
`;

<QuestionnaireEditor 
  initialFormData={yamlString}
  onChange={setFormData}
/>
```

## Saving & Exporting

The `onChange` callback receives the complete form data object with metadata:

```jsx
const handleChange = (formData) => {
  // formData includes:
  // - schemaType
  // - title
  // - description
  // - fields array
  
  // Save to localStorage
  localStorage.setItem('myForm', JSON.stringify(formData));
  
  // Or send to backend
  fetch('/api/forms', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};
```

## Custom Styling

Hide the header or add custom classes:

```jsx
<QuestionnaireEditor 
  initialFormData={formData}
  onChange={setFormData}
  showHeader={false}
  className="custom-editor-wrapper"
/>
```

## Next Steps

- [Editor Overview](/docs/editor/overview)
- [Editor Props](/docs/editor/props)
- [Importing & Schema Conversion](/docs/editor/importing)
- [Field Types](/docs/field-types)
- [Forms Editor README](https://github.com/mieweb/questionnaire-builder/tree/main/packages/forms-editor/README.md)
