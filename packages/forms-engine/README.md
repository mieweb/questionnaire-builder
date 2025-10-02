# @mieweb/forms-engine

Core state management, field components, and utilities for building FHIR-compatible questionnaire forms.

## 📦 Installation

```bash
npm install @mieweb/forms-engine
```

### Peer Dependencies

Ensure you have React 18+ installed:

```bash
npm install react react-dom
```

## 🎯 What's Included

This package provides the **foundation** for building questionnaires:

- **Field Components**: `TextInput_Field`, `Radio_Field`, `Check_Field`, `DropDown_Field`, `Section_Field`
- **State Management**: Zustand-based stores for form data and UI state
- **Field Utilities**: Field initialization, visibility logic, field type registry
- **Hooks & APIs**: `useFormApi`, `useUIApi`, `useFieldController`

## 🚀 Quick Start

### 1. Use Field Components

```jsx
import { TextInput_Field, Radio_Field, useFormStore } from '@mieweb/forms-engine';

function MyForm() {
  const fields = useFormStore(state => state.flatArray());

  return (
    <div>
      {fields.map(field => {
        if (field.fieldType === 'input') {
          return <TextInput_Field key={field.id} fieldId={field.id} />;
        }
        if (field.fieldType === 'radio') {
          return <Radio_Field key={field.id} fieldId={field.id} />;
        }
        // ... other types
      })}
    </div>
  );
}
```

### 3. Manage Form State

```jsx
import { useFormApi, useFormStore } from '@mieweb/forms-engine';

function FormManager() {
  const formApi = useFormApi();
  const fields = useFormStore(state => Object.values(state.byId));

  const addField = () => {
    formApi.add({
      id: crypto.randomUUID(),
      fieldType: 'input',
      question: 'What is your name?',
      answer: ''
    });
  };

  const exportData = () => {
    console.log(fields);
  };

  return (
    <div>
      <button onClick={addField}>Add Field</button>
      <button onClick={exportData}>Export JSON</button>
    </div>
  );
}
```

## 📚 Core Exports

### Field Components

```jsx
import {
  TextInput_Field,    // Text input field
  Radio_Field,        // Radio button group
  Check_Field,        // Checkbox field
  DropDown_Field,     // Dropdown/select field
  Section_Field       // Section container
} from '@mieweb/forms-engine';
```

### State Management

```jsx
import {
  useFormStore,       // Main form state store
  useFormApi,         // API for form mutations (add, update, delete)
  useUIStore,         // UI state (selected field, preview mode)
  useUIApi,           // API for UI state changes
  useField,           // Get single field by ID
  useChildField,      // Get child field within section
  useFieldsArray      // Get all fields as array
} from '@mieweb/forms-engine';
```

### Field Utilities

```jsx
import {
  fieldTypes,              // Field type registry
  getFieldComponent,       // Get component for field type
  registerFieldComponent,  // Register custom field type
  initializeField,         // Initialize field with defaults
  initializeFieldOptions,  // Initialize field options
  isVisible,              // Check field visibility (enableWhen logic)
  FieldWrapper,           // Wrapper component for fields
  useFieldController      // Hook for field state & handlers
} from '@mieweb/forms-engine';
```

### Icons

```jsx
import {
  TextIcon,
  RadioIcon,
  CheckIcon,
  DropDownIcon,
  SectionIcon,
  TrashIcon,
  CopyIcon,
  // ... more icons
} from '@mieweb/forms-engine';
```

## 🔧 Advanced Usage

### Custom Field Type

```jsx
import { registerFieldComponent, FieldWrapper } from '@mieweb/forms-engine';

function CustomDateField({ fieldId }) {
  return (
    <FieldWrapper fieldId={fieldId}>
      <input type="date" />
    </FieldWrapper>
  );
}

registerFieldComponent('date', {
  label: 'Date Field',
  component: CustomDateField,
  defaultProps: {
    fieldType: 'date',
    question: '',
    answer: ''
  }
});
```

### Conditional Visibility (enableWhen)

```jsx
import { isVisible, useFormStore } from '@mieweb/forms-engine';

function ConditionalField({ fieldId }) {
  const field = useFormStore(state => state.byId[fieldId]);
  const allFields = useFormStore(state => state.byId);

  if (!isVisible(field, allFields)) {
    return null; // Hide field based on logic
  }

  return <TextInput_Field fieldId={fieldId} />;
}
```

## 📖 API Reference

### `useFormApi()`

Returns API for form mutations:

- `add(field)` - Add new field
- `update(id, changes)` - Update field
- `remove(id)` - Remove field
- `replaceAll(fields)` - Replace entire form

### `useUIApi()`

Returns API for UI state:

- `selectedFieldId.set(id)` - Select field for editing
- `preview.set(boolean)` - Toggle preview mode

### `useFieldController(fieldId)`

Returns field state and handlers:

```jsx
const { field, updateField, removeField } = useFieldController(fieldId);
```

## 🎨 Styling

**CSS is automatically included** when you import the package! The Tailwind CSS styles are bundled directly into the JavaScript.

You can override styles by adding your own CSS classes or custom styles after importing the package.

## 📦 Bundle Size

- **52.43 KB** (ESM, uncompressed)
- Tree-shakeable exports

## 🔗 Related Packages

- **@mieweb/forms-editor** - Full questionnaire editor UI
- **@mieweb/forms-renderer** - Read-only renderer for filled forms

## 📄 License

MIT
