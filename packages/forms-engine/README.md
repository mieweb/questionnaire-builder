# 🔧 @mieweb/forms-engine

Core state management and field components for FHIR-compatible questionnaire forms.

## 📦 Installation

```bash
npm install @mieweb/forms-engine react react-dom
```

## 📋 What's Included

- **🔧 Field Components**: `TextInput_Field`, `Radio_Field`, `Check_Field`, `DropDown_Field`, `Section_Field`
- **🏪 State Management**: Zustand stores for form data and UI state
- **🛠️ Utilities**: Field initialization, visibility logic, field type registry
- **🪝 Hooks**: `useFormApi`, `useUIApi`, `useFieldController`

## 🚀 Quick Start

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
        return null;
      })}
    </div>
  );
}
```

## 🔧 Field Types

- `input` - 📝 Text input field
- `radio` - 🔘 Single selection radio buttons
- `check` - ☑️ Multiple selection checkboxes
- `selection` - 📋 Dropdown selection
- `section` - 📂 Container for grouping fields

## 🏪 State Management

```jsx
import { useFormStore } from '@mieweb/forms-engine';

// Initialize form
const replaceAll = useFormStore(state => state.replaceAll);
replaceAll(fieldsArray);

// Get current data
const fields = useFormStore(state => state.flatArray());
const fieldById = useFormStore(state => state.byId['field-id']);

// Update fields
const updateField = useFormStore(state => state.updateField);
updateField('field-id', { answer: 'new value' });
```

## 🔀 Conditional Visibility

```jsx
import { isVisible, useFormStore } from '@mieweb/forms-engine';

function ConditionalField({ fieldId }) {
  const field = useFormStore(state => state.byId[fieldId]);
  const allFields = useFormStore(state => state.byId);

  if (!isVisible(field, allFields)) {
    return null;
  }

  return <TextInput_Field fieldId={fieldId} />;
}
```

## 🎨 Custom Field Components

```jsx
import { useFieldController } from '@mieweb/forms-engine';

function CustomField({ fieldId, sectionId }) {
  const { field, updateField, isPreview } = useFieldController(fieldId, sectionId);

  return (
    <div>
      <label>{field.question}</label>
      <input
        value={field.answer || ''}
        onChange={(e) => updateField({ answer: e.target.value })}
        disabled={isPreview}
      />
    </div>
  );
}
```

## 📚 API Reference

### 🏪 useFormStore

- `replaceAll(fields)` - Replace all form data
- `updateField(id, updates, options)` - Update single field
- `flatArray()` - Get flat array of all fields
- `byId` - Object map of fields by ID

### 🖥️ useUIApi

- `isPreview` - Current preview mode state
- `setPreview(boolean)` - Toggle preview mode
- `selectedFieldId` - Currently selected field ID

### 📝 Field Structure

```typescript
{
  id: string;
  fieldType: 'input' | 'radio' | 'check' | 'selection' | 'section';
  question?: string;
  answer?: string;          // for input fields
  selected?: string;        // for radio/selection fields
  selectedOptions?: string[]; // for check fields
  options?: { id: string; value: string }[];
  enableWhen?: {
    logic: 'AND' | 'OR';
    conditions: {
      targetId: string;
      operator: 'equals' | 'contains' | 'includes';
      value: string;
    }[];
  };
}
```