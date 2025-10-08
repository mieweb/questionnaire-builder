# ✏️ @mieweb/forms-editor

Embeddable questionnaire editor component with FHIR export and conditional logic support.

## 📦 Installation

```bash
npm install @mieweb/forms-editor react react-dom
```

## 🚀 Quick Start

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
    <div className="w-full h-dvh bg-slate-100">
      <QuestionnaireEditor
        initialFields={fields}
        onChange={setFields}
      />
    </div>
  );
}
```

## ⚙️ Props

- `initialFields` - Array of field objects
- `onChange` - Callback when fields change
- `startInPreview` - Start in preview mode (default: false)

## ✨ Features

### 🔧 Field Types
- `input` - 📝 Text input
- `radio` - 🔘 Radio buttons
- `check` - ☑️ Checkboxes
- `selection` - 📋 Dropdown
- `section` - 📂 Field container

### 🔀 Conditional Logic (enableWhen)
Show/hide fields based on answers:
1. Select a field
2. Click "Logic" in the edit panel
3. Add conditions (e.g., "Show when Question 1 equals 'Yes'")

### 📤 Import/Export
- JSON format
- YAML format
- FHIR Questionnaire format

### 📱 Mobile Support
- Desktop: Side-by-side editor and preview
- Mobile: Swipeable modal for field editing

## 📝 Field Structure

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

## 🎨 Styling

Uses Tailwind CSS. Include in your project:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components'; 
@import 'tailwindcss/utilities';
```

## 🏥 Export FHIR

```jsx
import { exportToFHIR } from '@mieweb/forms-editor';

const fhirQuestionnaire = exportToFHIR(fields, {
  id: 'my-questionnaire',
  title: 'Patient Survey',
  version: '1.0'
});
```