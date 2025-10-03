# @mieweb/forms-editor `v0.1.4`

Embeddable questionnaire editor component with drag-and-drop, FHIR export, and conditional logic support.

## 📦 Installation

```bash
npm install @mieweb/forms-editor
```

### Peer Dependencies (Required)

You must install React 18+ in your project:

```bash
npm install react react-dom
```

### Automatic Dependencies

The following are installed automatically:

- `@mieweb/forms-engine` - Core form state and field components
- `framer-motion` - Animations
- `js-yaml` - YAML import/export

## 🚀 Quick Start

### Basic Usage

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  const [fields, setFields] = React.useState([
    { id: 'section-1', fieldType: 'section', title: 'Section 1', fields: [] },
    { id: 'name', fieldType: 'input', question: 'Your Name', required: true },
    { id: 'gender', fieldType: 'radio', question: 'Gender', options: [{ value: 'Male' }, { value: 'Female' }], selected: null },
  ]);

  return (
    <div className="w-full h-dvh bg-slate-100">
      <div className="absolute inset-0 overflow-auto">
        <QuestionnaireEditor
          initialFields={fields}
          onChange={setFields}
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
```

### With State Persistence

```jsx
function App() {
  const [fields, setFields] = React.useState(() => {
    const saved = localStorage.getItem('questionnaire');
    return saved ? JSON.parse(saved) : [];
  });

  const handleChange = (newFields) => {
    setFields(newFields);
    localStorage.setItem('questionnaire', JSON.stringify(newFields));
  };

  return (
    <div className="absolute inset-0 overflow-auto">
      <QuestionnaireEditor
        initialFields={fields}
        onChange={handleChange}
      />
    </div>
  );
}
```

---

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
<div className="absolute inset-0 overflow-auto">
  <QuestionnaireEditor
    className="custom-editor"
    initialFields={fields}
    onChange={setFields}
  />
</div>
```

### Start in Preview Mode

```jsx
<QuestionnaireEditor
  initialFields={fields}
  onChange={setFields}
  startInPreview={true}
/>
```

### Hide Header or Mobile Toolbar

```jsx
<QuestionnaireEditor
  initialFields={fields}
  onChange={setFields}
  showHeader={false}
  showMobileToolbar={false}
/>
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

- **ESM format** with tree-shaking support
- **TypeScript definitions** included
- **CSS automatically injected** - no manual imports needed
- Dependencies: `@mieweb/forms-engine`, `framer-motion`, `js-yaml`
- Peer dependencies: React 18+

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
