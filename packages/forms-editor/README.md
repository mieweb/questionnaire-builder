# @mieweb/forms-editor

Embeddable questionnaire editor component with drag-and-drop, FHIR export, and conditional logic support.

## 📦 Installation

```bash
npm install @mieweb/forms-editor
```

### Peer Dependencies

Ensure you have React 18+ installed:

```bash
npm install react react-dom
```

### Automatic Dependencies

The following are installed automatically:

- `@mieweb/forms-engine` - Core form state and field components
- `framer-motion` - Animations
- `js-yaml` - YAML import/export

## 🚀 Quick Start

### 1. Basic Usage

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {
  const handleChange = (fields) => {
    console.log('Form updated:', fields);
  };

  return (
    <QuestionnaireEditor
      onChange={handleChange}
    />
  );
}
```

### 3. With Initial Data

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

const initialFields = [
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
];

function App() {
  return (
    <QuestionnaireEditor
      initialFields={initialFields}
      onChange={(fields) => console.log(fields)}
    />
  );
}
```

## 📖 Props

### `QuestionnaireEditor`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialFields` | `Array` | `[]` | Initial questionnaire fields |
| `onChange` | `Function` | `undefined` | Callback when fields change: `(fields) => void` |
| `className` | `String` | `''` | Additional CSS classes |
| `showHeader` | `Boolean` | `true` | Show/hide the header with actions |
| `showMobileToolbar` | `Boolean` | `true` | Show/hide mobile toolbar |
| `startInPreview` | `Boolean` | `false` | Start in preview mode |

## ✨ Features

### 🎨 Add & Edit Fields

Add fields from the toolbar:
- **Text Input** - Single-line text
- **Radio Buttons** - Single choice
- **Checkboxes** - Multiple choice
- **Dropdown** - Select menu
- **Section** - Group fields together

### 🔄 Import/Export

Built-in support for:
- **JSON** - Questionnaire data format
- **FHIR** - FHIR Questionnaire standard
- **YAML** - Human-readable format

```jsx
import { useFormStore } from '@mieweb/forms-engine';

function ExportButtons() {
  const fields = useFormStore(state => state.flatArray());

  const exportJSON = () => {
    const json = JSON.stringify(fields, null, 2);
    // Download or save
  };

  return <button onClick={exportJSON}>Export JSON</button>;
}
```

### 🔀 Conditional Logic (enableWhen)

Show/hide fields based on answers to other fields:

1. Select a field
2. Click "Logic" in the edit panel
3. Add conditions (e.g., "Show when Question 1 equals 'Yes'")

### 📱 Mobile Responsive

- Desktop: Side-by-side editor and preview
- Mobile: Swipeable modal for field editing

### 🎭 Preview Mode

Toggle preview mode to see how the form looks to end users:

```jsx
<QuestionnaireEditor startInPreview={true} />
```

## 🎯 Advanced Usage

### Custom Styling

```jsx
<QuestionnaireEditor
  className="my-custom-editor"
  onChange={handleChange}
/>
```

```css
.my-custom-editor {
  --primary-color: #3b82f6;
  --border-radius: 0.5rem;
}
```

### Controlled State

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { useFormStore } from '@mieweb/forms-engine';
import { useEffect } from 'react';

function ControlledEditor() {
  const [savedFields, setSavedFields] = useState([]);

  const handleChange = (fields) => {
    setSavedFields(fields);
    localStorage.setItem('questionnaire', JSON.stringify(fields));
  };

  return (
    <QuestionnaireEditor
      initialFields={savedFields}
      onChange={handleChange}
    />
  );
}
```

### Accessing Internal State

```jsx
import { useFormStore, useUIStore } from '@mieweb/forms-engine';

function EditorWithStatus() {
  const fieldCount = useFormStore(state => Object.keys(state.byId).length);
  const isPreview = useUIStore(state => state.preview);

  return (
    <div>
      <p>{fieldCount} fields | Mode: {isPreview ? 'Preview' : 'Edit'}</p>
      <QuestionnaireEditor />
    </div>
  );
}
```

## 🔧 Field Structure

Each field follows this structure:

```js
{
  id: 'unique-id',              // Required: unique identifier
  fieldType: 'input',           // Required: 'input', 'radio', 'check', 'dropdown', 'section'
  question: 'Your question?',   // Required: field label
  answer: '',                   // For input fields
  options: ['A', 'B', 'C'],     // For radio/check/dropdown
  selected: null,               // For radio (single choice)
  selectedOptions: [],          // For check (multiple choice)
  fields: [],                   // For section (nested fields)
  enableWhen: [                 // Optional: conditional logic
    {
      question: 'field-id',
      operator: 'equals',
      answer: 'Yes'
    }
  ]
}
```

## 📦 Bundle Size

- **48.13 KB** (ESM, uncompressed)
- **489 B** CSS

## 🎨 Theming

**CSS is automatically included** when you import the package! The Tailwind CSS styles are bundled directly into the JavaScript.

Override styles by importing your custom CSS after the component:

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import './my-overrides.css'; // Your custom styles
```

## 🔗 Related Packages

- **@mieweb/forms-engine** - Core form primitives (auto-installed)
- **@mieweb/forms-renderer** - Read-only renderer for filled forms

## 📄 License

MIT
