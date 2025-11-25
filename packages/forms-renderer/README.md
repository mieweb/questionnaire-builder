# @mieweb/forms-renderer

Questionnaire renderer with three distribution options: React component, standalone Web Component, or Blaze component for Meteor.

## 🎨 Version 1.0 - UI/UX Refinement

All rendered field components now feature modern blue theme styling:
- Blue selection highlights and focus states throughout
- Improved hover effects for better user feedback
- Consistent visual design across all field types
- Enhanced accessibility with clear focus indicators
- Polished interactions in preview mode

See the [main CHANGELOG](../../CHANGELOG.md) for complete details.

## 🆕 New Features

### YAML & JSON Auto-Parsing
Pass YAML strings, JSON strings, or parsed objects:
```jsx
// YAML string
const yamlData = `
schemaType: mieforms-v1.0
fields:
  - id: name
    fieldType: text
    question: Name?
`;

<QuestionnaireRenderer formData={yamlData} />

// JSON string or object also work!
```

### Schema Auto-Detection
Schema type is automatically detected - no need to specify:
```jsx
<QuestionnaireRenderer 
  formData={unknownSchema}  // Auto-detects MIE Forms or SurveyJS
/>
```

### Flexible Styling
Pass custom CSS classes for styling:
```jsx
<QuestionnaireRenderer 
  formData={formData}
  className="custom-wrapper p-4"
/>
```

## Examples

- [`example-react.jsx`](./examples/example-react.jsx) - React component
- [`example-standalone.html`](./examples/example-standalone.html) - Web Component
- [`blaze-example.html`](./examples/blaze-example.html) - Blaze/Meteor

## Usage

Choose the method that fits your stack:

### 1. React Component (for React apps)

**Install:**
```bash
npm install @mieweb/forms-renderer react react-dom
```

**Basic Usage:**
```jsx
import { QuestionnaireRenderer, buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';

function MyForm() {
  const [formData] = React.useState({
    schemaType: 'mieforms-v1.0',
    fields: [
      {
        id: 'q-name',
        fieldType: 'text',
        question: 'What is your full name?',
        answer: ''
      }
    ]
  });
  
  const currentFields = useFieldsArray();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhir = buildQuestionnaireResponse(currentFields, 'my-questionnaire', 'patient-123');
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer formData={formData} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**With SurveyJS Schema:**
```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function SurveyForm() {
  const surveySchema = {
    pages: [{
      elements: [
        { type: 'text', name: 'firstName', title: 'First Name' },
        { type: 'text', name: 'lastName', title: 'Last Name' }
      ]
    }]
  };

  return (
    <QuestionnaireRenderer 
      formData={surveySchema}
      hideUnsupportedFields={true}
    />
  );
}
```

---

### 2. Standalone Web Component (framework-agnostic)

**Install:**
```bash
npm install @mieweb/forms-renderer
```
No peer dependencies required - bundles React internally.

**Usage:**
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
- `className` - Additional CSS classes
- `fullHeight` - Full viewport height mode
- `hideUnsupportedFields` - Hide unsupported field types (default: `true`)

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

Returns FHIR QuestionnaireResponse. Use with `useFieldsArray()` to get current form state:

```jsx
import { buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';

const currentFields = useFieldsArray();
const fhir = buildQuestionnaireResponse(currentFields, 'q-1', 'patient-123');
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