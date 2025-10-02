# @mieweb/forms-renderer

Read-only questionnaire renderer for displaying and filling out forms. Produces FHIR QuestionnaireResponse output.

## 📦 Installation

```bash
npm install @mieweb/forms-renderer
```

### Peer Dependencies

Ensure you have React 18+ installed:

```bash
npm install react react-dom
```

### Automatic Dependencies

The following is installed automatically:

- `@mieweb/forms-engine` - Core form state and field components

## 🚀 Quick Start

### 1. Basic Usage

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function App({ fields }) {
  const handleChange = (updatedFields) => {
    console.log('Form data:', updatedFields);
  };

  const handleSubmit = (fhirResponse) => {
    console.log('FHIR QuestionnaireResponse:', fhirResponse);
    // Send to your backend
  };

  return (
    <QuestionnaireRenderer
      fields={fields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      questionnaireId="patient-intake-v1"
      subjectId="patient-12345"
    />
  );
}
```

### 2. Field Structure

The `fields` prop accepts any data source (API, database, local storage) that matches this JSON structure:

```js
// Example: Simple questionnaire data
[
  {
    id: '1',
    fieldType: 'input',
    question: 'What is your name?',
    answer: ''
  },
  {
    id: '2',
    fieldType: 'radio',
    question: 'Select your role',
    options: ['Developer', 'Designer', 'Manager'],
    selected: null
  }
]

// Example: Complex medical screening with sections and conditional logic
[
  {
    fieldType: "section",
    title: "Patient Information",
    id: "sec-patient-info",
    fields: [
      { fieldType: "input", question: "First name", answer: "", id: "pi-first-name" },
      { fieldType: "input", question: "Last name",  answer: "", id: "pi-last-name" },
      {
        fieldType: "selection",
        question: "Biological sex",
        options: [
          { id: "pi-sex-m", value: "Male" },
          { id: "pi-sex-f", value: "Female" }
        ],
        selected: null,
        id: "pi-sex"
      }
    ]
  },
  {
    fieldType: "section",
    title: "Pregnancy & OB",
    id: "sec-pregnancy",
    enableWhen: {
      logic: "AND",
      conditions: [
        { targetId: "pi-sex", operator: "equals", value: "pi-sex-f" }
      ]
    },
    fields: [
      {
        fieldType: "radio",
        question: "Are you currently pregnant?",
        options: [
          { id: "preg-yes", value: "Yes" },
          { id: "preg-no", value: "No" }
        ],
        selected: null,
        id: "preg-status"
      }
    ]
  }
]
```

**Any JSON object matching this structure works** - whether from your backend API, a database query, local storage, or a CMS.

## 📖 Props

### `QuestionnaireRenderer`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fields` | `Array` | **Required** | Questionnaire definition from your data source (API, database, etc.) |
| `onChange` | `Function` | `undefined` | Callback when answers change: `(fields) => void` |
| `onSubmit` | `Function` | `undefined` | Callback on submit: `(fhirResponse) => void` |
| `questionnaireId` | `String` | `'questionnaire-1'` | ID for FHIR Questionnaire reference |
| `subjectId` | `String` | `undefined` | Patient/subject ID for FHIR response |
| `className` | `String` | `''` | Additional CSS classes |
| `fullHeight` | `Boolean` | `false` | Use full viewport height |

## ✨ Features

### ✅ Read-Only Display

- Displays questionnaire fields without editing controls
- Users can **fill out** the form but **cannot add/remove/reorder** fields

### 📋 Supported Field Types

- **Text Input** - Single-line text entry
- **Radio Buttons** - Single choice selection
- **Checkboxes** - Multiple choice selection
- **Dropdown** - Select menu
- **Section** - Grouped fields with collapse/expand

### 🔀 Conditional Logic (enableWhen)

Automatically shows/hides fields based on answers:

```jsx
const fields = [
  {
    id: '1',
    fieldType: 'radio',
    question: 'Do you have symptoms?',
    options: ['Yes', 'No'],
    selected: null
  },
  {
    id: '2',
    fieldType: 'input',
    question: 'Describe your symptoms',
    answer: '',
    enableWhen: [
      {
        question: '1',        // ID of field to check
        operator: 'equals',
        answer: 'Yes'
      }
    ]
  }
];
```

Field `2` only appears when field `1` is answered with "Yes".

### 🏥 FHIR QuestionnaireResponse

On submit, generates a standard FHIR R4 QuestionnaireResponse:

```js
{
  resourceType: "QuestionnaireResponse",
  id: "response-uuid",
  questionnaire: "questionnaire-1",
  status: "completed",
  authored: "2025-10-02T10:30:00Z",
  subject: {
    reference: "Patient/patient-12345"
  },
  item: [
    {
      linkId: "1",
      text: "What is your name?",
      answer: [
        {
          valueString: "John Doe"
        }
      ]
    }
    // ... more items
  ]
}
```

## 🎯 Usage Examples

### Saving Responses

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';
import { useState } from 'react';

function FormPage() {
  const [responses, setResponses] = useState([]);

  const handleSubmit = async (fhirResponse) => {
    // Save to backend
    await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fhirResponse)
    });

    setResponses([...responses, fhirResponse]);
    alert('Form submitted successfully!');
  };

  return (
    <QuestionnaireRenderer
      fields={fields}
      onSubmit={handleSubmit}
      questionnaireId="patient-intake"
      subjectId="patient-67890"
    />
  );
}
```

### Pre-filled Form

```jsx
const prefilledFields = [
  {
    id: '1',
    fieldType: 'input',
    question: 'Full Name',
    answer: 'Jane Doe' // Pre-filled
  },
  {
    id: '2',
    fieldType: 'radio',
    question: 'Gender',
    options: ['Male', 'Female', 'Other'],
    selected: 'Female' // Pre-filled
  }
];

<QuestionnaireRenderer fields={prefilledFields} />
```

### Real-time Validation

```jsx
function ValidatedForm() {
  const [errors, setErrors] = useState({});

  const handleChange = (fields) => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && !field.answer && !field.selected) {
        newErrors[field.id] = 'This field is required';
      }
    });

    setErrors(newErrors);
  };

  return (
    <div>
      <QuestionnaireRenderer
        fields={fields}
        onChange={handleChange}
      />
      {Object.values(errors).map(err => (
        <p className="text-red-500">{err}</p>
      ))}
    </div>
  );
}
```

## 🔧 Field Structure

Fields use the same structure as `@mieweb/forms-editor`:

```js
{
  id: 'unique-id',
  fieldType: 'input' | 'radio' | 'check' | 'dropdown' | 'section',
  question: 'Your question text',
  answer: '',                   // For input
  options: [],                  // For radio/check/dropdown
  selected: null,               // For radio
  selectedOptions: [],          // For check
  fields: [],                   // For section
  enableWhen: []               // Conditional logic
}
```

## 📦 Bundle Size

- **4.85 KB** (ESM, uncompressed)
- Very lightweight - perfect for embedding in patient portals

## 🎨 Styling

**CSS is automatically included** when you import the package! The styles come bundled via the `@mieweb/forms-engine` dependency.

Override with custom CSS:

```css
.qr-renderer-root {
  max-width: 800px;
  margin: 0 auto;
}

.qr-submit-btn {
  background: #10b981;
  color: white;
  padding: 0.75rem 2rem;
}
```

## 🔗 Related Packages

- **@mieweb/forms-engine** - Core form primitives (auto-installed)
- **@mieweb/forms-editor** - Full questionnaire editor UI

## 📄 License

MIT
