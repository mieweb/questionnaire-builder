# @mieweb/forms-editor

Embeddable questionnaire editor with FHIR export and conditional logic.

```bash
npm install @mieweb/forms-editor react react-dom
```

## 🆕 New Features

### YAML & JSON Import
Import questionnaires from YAML or JSON with automatic format detection:
- Drag and drop `.json`, `.yaml`, or `.yml` files
- Auto-detects MIE Forms vs SurveyJS schemas
- Preserves metadata (title, description, etc.)

### Auto-Parsing on Initialization
Pass YAML strings, JSON strings, or objects directly:
```jsx
// YAML string
const yamlData = `
schemaType: mieforms-v1.0
fields:
  - id: name
    fieldType: text
    question: Name?
`;

<QuestionnaireEditor initialFormData={yamlData} />

// Or JSON string, or parsed object - all work!
```

## Quick Start

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {
  const [formData, setFormData] = React.useState({
    schemaType: 'mieforms-v1.0',
    title: 'Patient Intake',
    fields: [
      { id: 'section-1', fieldType: 'section', title: 'Section 1', fields: [] },
      { id: 'name', fieldType: 'text', question: 'Your Name', required: true },
      { id: 'gender', fieldType: 'radio', question: 'Gender', 
        options: [{ value: 'Male' }, { value: 'Female' }], selected: null },
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

## Props

- `initialFormData` - Form data object or YAML/JSON string (supports auto-parsing)
- `schemaType` - Optional: `'mieforms'` or `'surveyjs'` (auto-detected if not provided)
- `onChange` - Callback when form data changes (receives complete form object with metadata)
- `startInPreview` - Start in preview mode (default: false)
- `hideUnsupportedFields` - Hide unsupported field types (default: false)
- `showHeader` - Show editor header (default: true)
- `className` - Additional CSS classes

## 🔄 Breaking Changes (v0.1.1)

### Prop Rename
```jsx
// ❌ Before
<QuestionnaireEditor initialFields={fields} />

// ✅ After
<QuestionnaireEditor initialFormData={formData} />
```

### onChange Callback
Now receives complete form data object instead of just fields array:
```jsx
// ❌ Before
onChange={(fields) => console.log(fields)}

// ✅ After
onChange={(formData) => {
  console.log(formData);
  // { schemaType: 'mieforms-v1.0', title: '...', fields: [...] }
}}
```

### Schema Type Required
Form data must include `schemaType` field:
```jsx
const formData = {
  schemaType: 'mieforms-v1.0', // Required!
  fields: [...]
};
```

## Features

### Field Types
- `text` - Single-line text input
- `longtext` - Multi-line text area
- `multitext` - Multiple labeled text inputs
- `boolean` - Yes/No button selection
- `radio` - Radio buttons
- `check` - Checkboxes
- `dropdown` - Dropdown selection
- `section` - Field container
- `unsupported` - Placeholder (can be hidden with `hideUnsupportedFields` prop)

### Conditional Logic
Show/hide fields based on answers via the Logic panel.

### Import/Export
- JSON, YAML formats with auto-detection
- SurveyJS schema import with conversion report
- FHIR export (via forms-engine)

### Mobile Support
Responsive with swipeable modal editing.

## Field Structure

```javascript
{
  id: 'unique-id',
  fieldType: 'text', // 'longtext', 'multitext', 'boolean', 'radio', 'check', 'dropdown', 'section'
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