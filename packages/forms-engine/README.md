# @mieweb/forms-engine

Core state management and field components for FHIR-compatible questionnaires.

```bash
npm install @mieweb/forms-engine react react-dom
```

## Includes

- Field components: `Text_Field`, `LongText_Field`, `MultiText_Field`, `Boolean_Field`, `Radio_Field`, `Check_Field`, `DropDown_Field`, `Section_Field`
- State management: Zustand stores for form data and UI state
- Utilities: Field initialization, visibility logic, schema adapter, YAML/JSON parser, ID generation
- Hooks: `useFormApi`, `useUIApi`, `useFieldController`
- CSS: Automatically injected (no manual imports needed)

## 🆕 New Features

### YAML & JSON Parsing
Parse YAML or JSON strings automatically:
```js
import { parseInput, parseAndDetect } from '@mieweb/forms-engine';

// Auto-parse YAML or JSON
const data = parseInput(yamlString); // or jsonString

// Parse + detect schema type
const { data, schemaType } = parseAndDetect(input);
// schemaType will be 'mieforms', 'surveyjs', or 'unknown'
```

### Schema Auto-Detection
Automatically detect schema format:
```js
import { detectSchemaType, adaptSchema } from '@mieweb/forms-engine';

const schemaType = detectSchemaType(data);
// Returns: 'mieforms' (requires explicit schemaType field)
//          'surveyjs' (checks for pages array)
//          'unknown'

const result = adaptSchema(data, schemaType);
// Returns: { fields: [...], conversionReport: {...} }
```

### Form Data with Metadata
Store and retrieve complete form data including metadata:
```js
import { useFormStore, useFormData } from '@mieweb/forms-engine';

// Initialize with metadata
useFormStore.getState().replaceAll({
  schemaType: 'mieforms-v1.0',
  title: 'Patient Intake',
  description: 'Initial screening',
  fields: [...]
});

// Retrieve complete form data
const formData = useFormData();
// Returns: { schemaType, title, description, fields: [...] }
```

## Quick Start

```jsx
import { Text_Field, LongText_Field, Radio_Field, Boolean_Field, useFormStore } from '@mieweb/forms-engine';

const fields = useFormStore(state => state.flatArray());

{fields.map(field => {
  if (field.fieldType === 'text') return <Text_Field key={field.id} fieldId={field.id} />;
  if (field.fieldType === 'longtext') return <LongText_Field key={field.id} fieldId={field.id} />;
  if (field.fieldType === 'boolean') return <Boolean_Field key={field.id} fieldId={field.id} />;
  if (field.fieldType === 'radio') return <Radio_Field key={field.id} fieldId={field.id} />;
  return null;
})}
```

## Field Types

- `text` - Single-line text input
- `longtext` - Multi-line text area
- `multitext` - Multiple labeled text inputs in one field
- `boolean` - Yes/No buttons
- `radio` - Single selection from options
- `check` - Multiple selection (checkboxes)
- `dropdown` - Dropdown selection
- `section` - Container for grouping fields

## State Management

```jsx
import { useFormStore, useFormData, useUIApi } from '@mieweb/forms-engine';

// Initialize with complete form data (with metadata)
useFormStore.getState().replaceAll({
  schemaType: 'mieforms-v1.0',
  title: 'My Form',
  fields: [...]
});

// Get complete form data (includes metadata)
const formData = useFormData();

// Get just fields array
const fields = useFormStore(state => state.flatArray());

// Update a field
const updateField = useFormStore(state => state.updateField);
updateField('field-id', { answer: 'new value' });

// UI state
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

  return <Text_Field fieldId={fieldId} />;
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

- `replaceAll(formData)` - Replace all form data (accepts `{ schemaType, ...metadata, fields }`)
- `updateField(id, updates)` - Update single field
- `flatArray()` - Get flat array of fields
- `byId` - Object map of fields by ID
- `schemaType` - Current schema type identifier
- `schemaMetadata` - Additional metadata (title, description, etc.)

### useFormData

Returns complete form data object with metadata:
```js
const formData = useFormData();
// { schemaType: 'mieforms-v1.0', title: '...', fields: [...] }
```

### useUIApi

- `preview.set(boolean)` - Toggle preview mode
- `selectedFieldId.value` - Currently selected field ID
- `setHideUnsupportedFields(boolean)` - Toggle hiding unsupported fields
- `setConversionReport(report)` - Store SurveyJS conversion report
- `clearConversionReport()` - Clear conversion report

### Schema Utilities

**`parseInput(input)`** - Parse YAML or JSON string to object
**`parseAndDetect(input, manualSchemaType?)`** - Parse and detect schema type
**`detectSchemaType(data)`** - Detect schema format
**`adaptSchema(data, schemaType)`** - Convert schema to MIE Forms format
**`MIE_FORMS_SCHEMA_TYPE`** - Constant: `'mieforms-v1.0'`

### Field Structure

```typescript
{
  id: string;
  fieldType: 'text' | 'longtext' | 'multitext' | 'boolean' | 'radio' | 'check' | 'dropdown' | 'section' | 'unsupported';
  question?: string;
  answer?: string;          // for text/longtext fields
  selected?: string;        // for radio/dropdown/boolean fields
  options?: { id: string; value: string; answer?: string }[]; // answer for multitext
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

## 🔄 Breaking Changes (v0.1.1)

### Stricter Schema Detection
MIE Forms now **require** explicit `schemaType` field:
```js
// ❌ Before (implicit detection)
const data = { fields: [...] };

// ✅ After (explicit schemaType)
const data = { 
  schemaType: 'mieforms-v1.0',
  fields: [...] 
};
```

### Field Initialization
- Fields now use `defaultProps` from `fieldTypes-config.js`
- Options arrays only added to choice-type fields (radio, check, dropdown)
- No more empty `options: []` on text fields

### replaceAll API Change
```js
// ❌ Before
useFormStore.getState().replaceAll([...fields]);

// ✅ After
useFormStore.getState().replaceAll({
  schemaType: 'mieforms-v1.0',
  fields: [...]
});
```

### Auto-Detection
Pass `null` for schema type to enable auto-detection:
```js
const { data, schemaType } = parseAndDetect(input, null);
```