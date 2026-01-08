---
sidebar_position: 3
---

# Importing & Schema Conversion

The editor accepts either MIE Forms schemas (native) or SurveyJS schemas (import + conversion).

## MIE Forms (native)

Pass an object (or YAML/JSON string) that includes `schemaType` and `fields`:

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

const formData = {
  schemaType: 'mieforms-v1.0',
  title: 'Patient Intake',
  description: 'Collect basic information',
  fields: [
    { id: 'name', fieldType: 'text', question: 'Full Name', required: true, answer: '' }
  ]
};

<QuestionnaireEditor initialFormData={formData} />
```

### Metadata preservation

When importing MIE Forms, the editor preserves root-level metadata (everything except `fields` and `schemaType`) and returns it back through `onChange`.

## SurveyJS import

If you pass a SurveyJS schema, the editor converts it to MIE Forms fields.

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

const survey = {
  pages: [{
    elements: [
      { type: 'text', name: 'firstName', title: 'First Name' },
      { type: 'rating', name: 'satisfaction', title: 'Satisfaction' }
    ]
  }]
};

<QuestionnaireEditor initialFormData={survey} schemaType="surveyjs" />
```

### What you get back

- The editor normalizes the result into MIE Forms: `schemaType: 'mieforms-v1.0'` and a `fields` array.
- The editor preserves SurveyJS metadata during import (it is attached to the schema it emits via `onChange`).

### Paste-time Conversion

When you **paste** a SurveyJS schema directly into the Code Editor:

1. **Automatic Detection** - The editor detects SurveyJS format immediately
2. **User Confirmation** - Shows a modal with two options:
   - **"Yes, Convert"** - Converts to MIE Forms and updates the editor
   - **"No, Cancel Paste"** - Cancels the paste, restores previous content
3. **Conversion Report** - If converted, shows details about converted and dropped fields

This prevents accidental overwrites and gives you control over when conversion happens.

### File Import Conversion

When importing SurveyJS schemas via the **Import** button:

1. **Schema Detection** - Automatically detects SurveyJS format from the file
2. **Confirmation Modal** - Asks "Is this a SurveyJS schema? Yes, Import / Abort"
3. **Conversion** - If confirmed, converts to MIE Forms and loads into editor
4. **Success Message** - Shows how many fields were imported and conversion details

## YAML and JSON strings

Both JSON and YAML strings are supported:

```jsx
const yaml = `
schemaType: mieforms-v1.0
title: Contact Form
fields:
  - id: email
    fieldType: text
    question: Email
    required: true
    answer: ''
`;

<QuestionnaireEditor initialFormData={yaml} />
```

## Unsupported fields

If a source schema contains elements that cannot be converted, the editor will still import what it can and expose conversion warnings in the UI.
