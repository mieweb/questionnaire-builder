# 📋 @mieweb/forms-renderer

Read-only questionnaire renderer with dual distribution: React component or Standalone Web Component.

## 📦 Installation

```bash
npm install @mieweb/forms-renderer
```

## 🚀 Examples

See the complete working examples in this package:
- [`example-react.jsx`](./example-react.jsx) - ⚛️ React component usage
- [`example-standalone.html`](./example-standalone.html) - 🌐 Web Component usage

## 💻 Usage

### ⚛️ React Component (Recommended for React Projects)

Requires React peer dependencies:
```bash
npm install react react-dom
```

From [`example-react.jsx`](./example-react.jsx):
```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

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

  return (
    <QuestionnaireRenderer
      questionnaireId="demo-questionnaire"
      fields={fields}
      onChange={(updatedFields) => console.log('Changed:', updatedFields)}
      onSubmit={(fhirResponse) => console.log('Submitted:', fhirResponse)}
    />
  );
}
```

### 🌐 Standalone Web Component (Framework-Agnostic)

✨ Zero dependencies - works with any framework or vanilla JS.

From [`example-standalone.html`](./example-standalone.html):
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
  
  renderer.onSubmit = (fhirResponse) => {
    console.log('Form submitted:', fhirResponse);
  };
</script>

<questionnaire-renderer 
  questionnaire-id="standalone-demo" 
  full-height>
</questionnaire-renderer>
```

## ⚙️ Props/Attributes

### ⚛️ React Component
- `fields` - Questionnaire definition array
- `onChange` - Callback when answers change
- `onSubmit` - Callback on form submit
- `questionnaireId` - FHIR Questionnaire ID
- `subjectId` - Patient/subject ID
- `className` - CSS classes
- `fullHeight` - Full viewport height

### 🌐 Web Component
- `questionnaire-id` - FHIR Questionnaire ID (attribute)
- `full-height` - Full viewport height (attribute)
- `fields` - Questionnaire definition (property)
- `onChange` - Change callback (property)
- `onSubmit` - Submit callback (property)

## 🔧 Field Types

- `input` - 📝 Text input field
- `radio` - 🔘 Single selection radio buttons
- `check` - ☑️ Multiple selection checkboxes
- `selection` - 📋 Dropdown selection
- `section` - 📂 Container for grouping fields

## 🔀 Conditional Logic (enableWhen)

Fields can be shown/hidden based on other field values. Both examples include conditional logic:

From [`example-react.jsx`](./example-react.jsx):
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