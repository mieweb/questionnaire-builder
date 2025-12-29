# @mieweb/forms-renderer

Display questionnaires with three integration options: React, standalone Web Component, or Meteor Blaze.

## Installation

```bash
npm install @mieweb/forms-renderer
```

**Requirements:** React 18+ and React DOM 18+ (except for standalone and Blaze integrations which bundle React)

## Quick Start

### React Component

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function MyForm() {
  const formData = {
    schemaType: 'mieforms-v1.0',
    fields: [
      { id: 'name', fieldType: 'text', question: 'Your name?', answer: '' }
    ]
  };

  return <QuestionnaireRenderer formData={formData} />;
}
```

### Standalone Web Component

```html
<script type="module">
  import '@mieweb/forms-renderer/standalone';
  
  document.querySelector('questionnaire-renderer').formData = {
    schemaType: 'mieforms-v1.0',
    fields: [...]
  };
</script>

<questionnaire-renderer></questionnaire-renderer>
```

### Meteor Blaze

```javascript
import '@mieweb/forms-renderer/blaze';
```

```handlebars
{{> questionnaireRenderer formData=myFormData}}
```

## Documentation

**[Full Documentation](https://questionnaire-builder.opensource.mieweb.org/docs/renderer/overview)**

For detailed information, see:
- [Quick Start Guide](https://questionnaire-builder.opensource.mieweb.org/docs/getting-started/quickstart-renderer)
- [Props Reference](https://questionnaire-builder.opensource.mieweb.org/docs/renderer/props)
- [Get Response](https://questionnaire-builder.opensource.mieweb.org/docs/renderer/get-response)
- [Web Component](https://questionnaire-builder.opensource.mieweb.org/docs/renderer/web-component)
- [Blaze Integration](https://questionnaire-builder.opensource.mieweb.org/docs/renderer/blaze)

## Examples

- [`example-react.jsx`](./examples/example-react.jsx)
- [`example-standalone.html`](./examples/example-standalone.html)
- [`blaze-example.html`](./examples/blaze-example.html)

## License

MIT
```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@mieweb/forms-renderer/standalone';
  </script>
</head>
<body>
  <form id="myForm">
    <questionnaire-renderer></questionnaire-renderer>
    <button type="submit">Submit</button>
  </form>

  <script>
    const renderer = document.querySelector('questionnaire-renderer');
    
    // Auto-detection enabled by default (or set explicitly)
    // renderer.schemaType = 'mieforms'; // or 'surveyjs'
    
    // Hide unsupported field types (default: true)
    renderer.hideUnsupportedFields = true;
    
    renderer.formData = {
      schemaType: 'mieforms-v1.0',
      fields: [
        {
          id: 'q-name',
          fieldType: 'text',
          question: 'Full Name',
          answer: ''
        }
      ]
    };
    
    document.getElementById('myForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fhir = renderer.getQuestionnaireResponse('q-1', 'patient-123');
      console.log(fhir);
    });
  </script>
</body>
</html>
```

---

### 3. Blaze Component (for Meteor apps)

**Install:**
```bash
meteor npm install @mieweb/forms-renderer
```

**Usage:**
```javascript
// In your Meteor client code
import '@mieweb/forms-renderer/blaze';

// If the above doesn't work in your Meteor version, try:
// import '@mieweb/forms-renderer/dist/blaze.js';
```

**In your Blaze template:**
```handlebars
{{> questionnaireRenderer 
    formData=myFormData 
    hideUnsupportedFields=true 
  onChange=handleChange}}
```

**Helper example:**
```javascript
Template.myTemplate.helpers({
  myFormData() {
    return {
      schemaType: 'mieforms-v1.0',
      fields: [
        { id: 'q1', fieldType: 'text', question: 'Name?', answer: '' }
      ]
    };
  },
  handleChange() {
    return (updatedFormData) => {
      console.log('Form changed:', updatedFormData);
    };
  }
});
```

---

## API Reference

### React Component Props

- `formData` - Form data object, YAML string, or JSON string (supports auto-parsing)
- `schemaType` - Optional: `'mieforms'` or `'surveyjs'` (auto-detected if not provided)
- `onChange` - Callback when answers change (receives complete form data object)
- `onQuestionnaireResponse` - Callback when answers change (receives FHIR `QuestionnaireResponse`)
- `questionnaireId` - Questionnaire identifier used in the generated `QuestionnaireResponse` (default: `'questionnaire-1'`)
- `subjectId` - Optional subject id used in the generated `QuestionnaireResponse` (`Patient/{subjectId}`)
- `className` - Additional CSS classes
- `fullHeight` - Full viewport height mode
- `hideUnsupportedFields` - Hide unsupported field types (default: `true`)
- `storeRef` - Optional ref to access the internal store instance (advanced)

### 🔄 Breaking Changes (v0.1.14)

**Prop Rename:**
```jsx
// ❌ Before
<QuestionnaireRenderer fields={fields} />

// ✅ After
<QuestionnaireRenderer formData={formData} />
```

**onChange Callback:**
```jsx
// ❌ Before
onChange={(fields) => console.log(fields)}

// ✅ After
onChange={(formData) => console.log(formData)}
// formData = { schemaType, ...metadata, fields: [...] }
```

**Default for hideUnsupportedFields:**
```jsx
// Before: default was false
// After: default is true
<QuestionnaireRenderer 
  formData={data}
  hideUnsupportedFields={false}  // Explicitly set if you want to show unsupported
/>
```

### React Helpers

**`buildQuestionnaireResponse(fields, questionnaireId, subjectId)`**

Returns a FHIR `QuestionnaireResponse` for a given `fields` array. In React, you’ll typically either:

- Use `onQuestionnaireResponse` to receive a ready-to-use response, or
- Use `onChange` and pass `formData.fields` into `buildQuestionnaireResponse`.

```jsx
import React from 'react';
import { QuestionnaireRenderer, buildQuestionnaireResponse } from '@mieweb/forms-renderer';

export function MyForm({ formData }) {
  const [latestFields, setLatestFields] = React.useState([]);

  const onSubmit = (e) => {
    e.preventDefault();
    const fhir = buildQuestionnaireResponse(latestFields, 'q-1', 'patient-123');
    console.log(fhir);
  };

  return (
    <form onSubmit={onSubmit}>
      <QuestionnaireRenderer formData={formData} onChange={(fd) => setLatestFields(fd.fields)} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Web Component API

- `renderer.formData` - Set/get form data (property) - accepts object, YAML, or JSON string
- `renderer.onChange` - Set change callback (property)
- `renderer.schemaType` - Optional: `'mieforms'` or `'surveyjs'` (auto-detected if not set)
- `renderer.hideUnsupportedFields` - Boolean to hide unsupported types (default: `true`)
- `renderer.getQuestionnaireResponse(id, subjectId)` - Get FHIR response (method)

**Migration:**
```js
// ❌ Before
renderer.fields = [...];

// ✅ After
renderer.formData = { schemaType: 'mieforms-v1.0', fields: [...] };
```

### Blaze Component Data Context

- `formData` - Form data object (with `schemaType` and `fields`)
- `schemaType` - Optional: `'mieforms'` or `'surveyjs'` (auto-detected if not provided)
- `onChange` - Change callback function (receives complete form data object)
- `onQuestionnaireResponse` - Callback when answers change (receives FHIR `QuestionnaireResponse`)
- `questionnaireId` - Questionnaire identifier used in the generated `QuestionnaireResponse` (default: `'questionnaire-1'`)
- `subjectId` - Optional subject id used in the generated `QuestionnaireResponse` (`Patient/{subjectId}`)
- `hideUnsupportedFields` - Boolean to hide unsupported types (default: `true`)
- `fullHeight` - Boolean for full height mode

**Migration:**
```handlebars
<!-- ❌ Before -->
{{> questionnaireRenderer fields=myFields}}

<!-- ✅ After -->
{{> questionnaireRenderer formData=myFormData}}
```

## Field Types

- `text` - Single-line text input
- `longtext` - Multi-line text area
- `multitext` - Multiple labeled text inputs
- `boolean` - Yes/No button selection
- `radio` - Single selection
- `check` - Multiple selection
- `dropdown` - Dropdown selection
- `section` - Container for grouping

## Conditional Logic

Show/hide fields based on other answers:
```javascript
{
  id: 'sec-pregnancy',
  fieldType: 'section',
  title: 'Pregnancy Information',
  enableWhen: {
    logic: 'AND',
    conditions: [
      { targetId: 'q-gender', operator: 'equals', value: 'gender-female' }
    ]
  },
  fields: [
    {
      id: 'q-weeks',
      fieldType: 'text',
      question: 'Weeks gestation (if known)',
      answer: '',
      enableWhen: {
        logic: 'AND',
        conditions: [
          { targetId: 'q-pregnant', operator: 'equals', value: 'preg-yes' }
        ]
      }
    }
  ]
}
```

## FHIR Output

FHIR QuestionnaireResponse format:

```javascript
{
  resourceType: 'QuestionnaireResponse',
  questionnaire: 'demo-1',
  status: 'completed',
  authored: '2023-01-01T12:00:00Z',
  item: [
    {
      linkId: 'q1',
      text: 'What is your name?',
      answer: [{ valueString: 'John Doe' }]
    }
  ]
}
```
