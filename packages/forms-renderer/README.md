# @mieweb/forms-renderer

Questionnaire renderer with three distribution options: React component, standalone Web Component, or Blaze component for Meteor.

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
    const fhir = buildQuestionnaireResponse(currentFields, 'my-questionnaire', 'patient-123');
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer fields={fields} />
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
      fields={surveySchema}
      schemaType="surveyjs"
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
    
    // Set schema type for SurveyJS schemas
    renderer.schemaType = 'surveyjs';
    
    // Hide unsupported field types
    renderer.hideUnsupportedFields = true;
    
    renderer.fields = [
      {
        id: 'q-name',
        fieldType: 'input',
        question: 'Full Name',
        answer: ''
      }
    ];
    
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
import { registerBlazeTemplate } from '@mieweb/forms-renderer/blaze';
registerBlazeTemplate();
```

**In your Blaze template:**
```handlebars
{{> questionnaireRenderer 
    fields=myFields 
    schemaType="surveyjs" 
    hideUnsupportedFields=true 
    onChange=handleChange}}
```

**Helper example:**
```javascript
Template.myTemplate.helpers({
  myFields() {
    return [
      { id: 'q1', fieldType: 'input', question: 'Name?', answer: '' }
    ];
  },
  handleChange() {
    return (updatedFields) => {
      console.log('Fields changed:', updatedFields);
    };
  }
});
```

---

## API Reference

### React Component Props

- `fields` - Questionnaire definition array
- `schemaType` - `'inhouse'` (default) or `'surveyjs'`
- `onChange` - Callback when answers change
- `className` - Additional CSS classes
- `fullHeight` - Full viewport height mode
- `hideUnsupportedFields` - Hide unsupported field types

### React Helpers

**`buildQuestionnaireResponse(fields, questionnaireId, subjectId)`**

Returns FHIR QuestionnaireResponse. Use with `useFieldsArray()` to get current form state:

```jsx
import { buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';

const currentFields = useFieldsArray();
const fhir = buildQuestionnaireResponse(currentFields, 'q-1', 'patient-123');
```

### Web Component API

- `renderer.fields` - Set/get questionnaire definition (property)
- `renderer.onChange` - Set change callback (property)
- `renderer.schemaType` - Set to `'surveyjs'` for SurveyJS schemas (property)
- `renderer.hideUnsupportedFields` - Boolean to hide unsupported types (property)
- `renderer.getQuestionnaireResponse(id, subjectId)` - Get FHIR response (method)

### Blaze Component Data Context

- `fields` - Questionnaire definition array
- `schemaType` - `'inhouse'` or `'surveyjs'`
- `onChange` - Change callback function
- `hideUnsupportedFields` - Boolean to hide unsupported types
- `fullHeight` - Boolean for full height mode

## Field Types

- `input` - Text input
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