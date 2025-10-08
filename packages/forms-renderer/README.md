# 📋 @mieweb/forms-renderer

Read-only questionnaire renderer with dual distribution: React component or Standalone Web Component.

## 📦 Installation

```bash
npm install @mieweb/forms-renderer
```

## 🚀 Examples

See the complete working examples in this package:
- [`example-react.jsx`](./examples/example-react.jsx) - ⚛️ React component usage
- [`example-standalone.html`](./examples/example-standalone.html) - 🌐 Web Component usage

## 💻 Usage

### ⚛️ React Component (Recommended for React Projects)

Requires React peer dependencies:
```bash
npm install react react-dom
```

#### Basic Usage (Custom Submit Button)
```jsx
import { QuestionnaireRenderer, buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';

function MyForm() {
  const [fields] = React.useState([
    {
      id: 'q-name',
      fieldType: 'input',
      question: 'What is your full name?',
      answer: ''
    }
  ]);
  
  const currentFields = useFieldsArray();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhirResponse = buildQuestionnaireResponse(currentFields, 'my-questionnaire', 'patient-123');
    console.log('Submitted:', fhirResponse);
    // Send to your API, etc.
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer 
        fields={fields}
        onChange={(updated) => console.log('Changed:', updated)}
      />
      <button type="submit">Submit Questionnaire</button>
    </form>
  );
}
```

#### With Sections and Conditional Logic
From [`example-react.jsx`](./examples/example-react.jsx):
```jsx
import { QuestionnaireRenderer, buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';

function App() {
  const [fields] = React.useState([
    {
      id: 'sec-1',
      fieldType: 'section',
      title: 'Personal Information',
      fields: [
        {
          id: 'q-name',
          fieldType: 'input',
          question: 'What is your full name?',
          answer: ''
        },
        {
          id: 'q-gender',
          fieldType: 'radio',
          question: 'Biological sex',
          options: [
            { id: 'gender-male', value: 'Male' },
            { id: 'gender-female', value: 'Female' }
          ],
          selected: null
        }
      ]
    }
  ]);
  
  const currentFields = useFieldsArray();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhirResponse = buildQuestionnaireResponse(currentFields, 'demo-1', 'patient-123');
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer fields={fields} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 🌐 Standalone Web Component (Framework-Agnostic)

✨ Zero dependencies - works with any framework or vanilla JS.

From [`example-standalone.html`](./examples/example-standalone.html):
```html
<script type="module">
  import './package/dist/standalone.js';
  
  const renderer = document.querySelector('questionnaire-renderer');
  renderer.fields = [
    {
      id: 'sec-1',
      fieldType: 'section',
      title: 'Patient Information',
      fields: [
        {
          id: 'q-name',
          fieldType: 'input',
          question: 'Full Name',
          answer: ''
        },
        {
          id: 'q-gender',
          fieldType: 'radio',
          question: 'Biological sex',
          options: [
            { id: 'gender-male', value: 'Male' },
            { id: 'gender-female', value: 'Female' }
          ],
          selected: null
        }
      ]
    }
  ];
  
  // Handle form submission
  const form = document.getElementById('myForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fhirResponse = renderer.getQuestionnaireResponse('q-1', 'patient-123');
    console.log('Form submitted:', fhirResponse);
  });
</script>

<form id="myForm">
  <questionnaire-renderer full-height></questionnaire-renderer>
  <button type="submit">Submit</button>
</form>
```

## ⚙️ API Reference

### `<QuestionnaireRenderer>` Component
React component for rendering questionnaires (no built-in submit button).

**Props:**
- `fields` *(array)* - Questionnaire definition array
- `onChange` *(function)* - Callback when answers change: `(updatedFields) => void`
- `className` *(string)* - Additional CSS classes
- `fullHeight` *(boolean)* - Full viewport height mode

### Helper Functions

#### `buildQuestionnaireResponse(fields, questionnaireId, subjectId)`
Build FHIR QuestionnaireResponse from fields. Use with `useFieldsArray()`.

**Parameters:**
- `fields` *(array)* - Current form fields (from `useFieldsArray()`)
- `questionnaireId` *(string)* - FHIR Questionnaire ID
- `subjectId` *(string, optional)* - Patient/subject ID

**Returns:** FHIR QuestionnaireResponse object

**Example:**
```jsx
import { buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';

function MyForm() {
  const currentFields = useFieldsArray();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhirResponse = buildQuestionnaireResponse(currentFields, 'q-1', 'patient-123');
    // Send to API, save to database, etc.
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 🌐 Web Component
- `full-height` - Full viewport height (attribute)
- `fields` - Questionnaire definition (property)
- `onChange` - Change callback (property)
- `getQuestionnaireResponse(questionnaireId, subjectId)` - Get FHIR response (method)

## 🔧 Field Types

- `input` - 📝 Text input field
- `radio` - 🔘 Single selection radio buttons
- `check` - ☑️ Multiple selection checkboxes
- `selection` - 📋 Dropdown selection
- `section` - 📂 Container for grouping fields

## 🔀 Conditional Logic (enableWhen)

Fields can be shown/hidden based on other field values. Both examples include conditional logic:

From [`example-react.jsx`](./examples/example-react.jsx):
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
      fieldType: 'input',
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

## 🏥 FHIR Output

The `onSubmit` callback receives a FHIR QuestionnaireResponse:

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

## 📊 Bundle Sizes

- **⚛️ React version**: ~24 KB (requires peer deps)
- **🌐 Standalone version**: ~819 KB (zero dependencies)

## 📚 Documentation

- [⚛️ React Component Example](./examples/example-react.jsx)
- [🌐 Web Component Example](./examples/example-standalone.html)