# @mieweb/forms-editor

Embeddable questionnaire editor with FHIR export and conditional logic.

```bash
npm install @mieweb/forms-editor react react-dom
```

## Quick Start

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {
  const [fields, setFields] = React.useState([
    { id: 'section-1', fieldType: 'section', title: 'Section 1', fields: [] },
    { id: 'name', fieldType: 'input', question: 'Your Name', required: true },
    { id: 'gender', fieldType: 'radio', question: 'Gender', 
      options: [{ value: 'Male' }, { value: 'Female' }], selected: null },
  ]);

  return (
    <QuestionnaireEditor initialFields={fields} onChange={setFields} />
  );
}
```

## Props

- `initialFields` - Array of field objects
- `onChange` - Callback when fields change
- `startInPreview` - Start in preview mode

## Features

### Field Types
- `input` - Text input
- `radio` - Radio buttons
- `check` - Checkboxes
- `dropdown` - Dropdown
- `section` - Field container
- `unsupported` - Placeholder (can be hidden)

### Conditional Logic
Show/hide fields based on answers via the Logic panel.

### Import/Export
- JSON, YAML, FHIR formats

### Mobile Support
Responsive with swipeable modal editing.

## Field Structure

```javascript
{
  id: 'unique-id',
  fieldType: 'input', // 'radio', 'check', 'selection', 'section'
  question: 'What is your name?',
  answer: '',
  required: false,
  enableWhen: {
    logic: 'AND', // or 'OR'
    conditions: [
      {
        targetId: 'other-field-id',
        operator: 'equals', // 'contains', 'includes'
        value: 'expected-value'
      }
    ]
  }
}
```