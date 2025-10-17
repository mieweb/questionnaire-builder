# @mieweb/forms-engine

Core state management and field components for FHIR-compatible questionnaires.

```bash
npm install @mieweb/forms-engine react react-dom
```

## Includes

- Field components: `TextInput_Field`, `Radio_Field`, `Check_Field`, `DropDown_Field`, `Section_Field`
- State management: Zustand stores for form data and UI state
- Utilities: Field initialization, visibility logic, schema adapter
- Hooks: `useFormApi`, `useUIApi`, `useFieldController`

## Quick Start

```jsx
import { TextInput_Field, Radio_Field, useFormStore } from '@mieweb/forms-engine';

const fields = useFormStore(state => state.flatArray());

{fields.map(field => {
  if (field.fieldType === 'input') return <TextInput_Field key={field.id} fieldId={field.id} />;
  if (field.fieldType === 'radio') return <Radio_Field key={field.id} fieldId={field.id} />;
  return null;
})}
```

## Field Types

- `input` - Text input
- `radio` - Single selection
- `check` - Multiple selection
- `dropdown` - Dropdown selection
- `section` - Container for grouping

## State Management

```jsx
import { useFormStore, useUIApi } from '@mieweb/forms-engine';

useFormStore.getState().replaceAll(fieldsArray);
const fields = useFormStore(state => state.flatArray());
const updateField = useFormStore(state => state.updateField);
updateField('field-id', { answer: 'new value' });

const ui = useUIApi();
ui.setHideUnsupportedFields(true);
```

## Conditional Visibility

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

## API

### useFormStore

- `replaceAll(fields)` - Replace all form data
- `updateField(id, updates)` - Update single field
- `flatArray()` - Get flat array of fields
- `byId` - Object map of fields by ID

### useUIApi

- `preview.set(boolean)` - Toggle preview mode
- `selectedFieldId.value` - Currently selected field ID
- `setHideUnsupportedFields(boolean)` - Toggle hiding unsupported fields

### Field Structure

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