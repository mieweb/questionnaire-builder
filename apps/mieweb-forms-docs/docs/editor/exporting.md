---
sidebar_position: 4
---

# Exporting Forms

Export your questionnaire schema as JSON for use in the renderer or external systems.

## Definition vs Response

**New in v1.0:** The editor exports **MIE Forms schema (clean definition)** by default — structure and questions only, without user answers. This separation makes templates reusable and easier to version control.

- **MIE Forms Definition** = Schema with fields, questions, options, logic (no `answer`/`selected`)
- **Form Response** = User's filled-in answers

When you export from the editor, you get the MIE Forms schema definition ready to be deployed as a template.

---

## Export Button

Click the **Export** button in the header to download your form.

```jsx
// In your app using the editor
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function MyEditor() {
  const [formData, setFormData] = React.useState(null);

  return (
    <QuestionnaireEditor 
      initialFormData={formData}
      onChange={setFormData}
    />
  );
}
```

The built-in export button downloads the complete schema as `questionnaire.json`.

---

## Using onChange Callback

Get the form data programmatically in real-time:

```jsx
import React from 'react';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function MyEditor() {
  const [formData, setFormData] = React.useState({
    schemaType: 'mieforms-v1.0',
    fields: []
  });

  const handleSave = () => {
    // Save to backend
    fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  };

  return (
    <div>
      <QuestionnaireEditor 
        initialFormData={formData}
        onChange={setFormData}
      />
      <button onClick={handleSave}>Save to Server</button>
    </div>
  );
}
```

---

## Export Format

The exported JSON is **MIE Forms schema (definition only)** — no user answers:

```json
{
  "schemaType": "mieforms-v1.0",
  "title": "Patient Intake Form",
  "description": "Collect patient information",
  "fields": [
    {
      "id": "name",
      "fieldType": "text",
      "question": "Full Name",
      "required": true
    },
    {
      "id": "dob",
      "fieldType": "text",
      "question": "Date of Birth",
      "inputType": "date"
    }
  ]
}
```

Notice there are no `answer` or `selected` properties — this is the MIE Forms schema definition ready to be loaded into the renderer.

---

## What Gets Exported

The export includes:

- **Schema Identifier** - Always `"mieforms-v1.0"` (marks this as a MIE Forms schema)
- **Metadata** - `title`, `description`, and any custom root properties
- **Fields Array** - Complete field definitions (structure and questions)
- **Sections** - Nested field structures
- **Conditional Logic** - All `enableWhen` rules

**What's excluded:**
- User answers (`answer`, `selected` properties are stripped)
- Drawing data (`signatureData`, `markupData`)
- Any response-specific data

This gives you a clean, reusable template ready to deploy.

---

## Using Exported Forms

### In the Renderer

Load exported forms directly into the renderer:

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function MyForm() {
  const [formData, setFormData] = React.useState(null);

  React.useEffect(() => {
    // Load exported form
    fetch('/forms/patient-intake.json')
      .then(res => res.json())
      .then(setFormData);
  }, []);

  return formData ? <QuestionnaireRenderer formData={formData} /> : null;
}
```

### In External Systems

The JSON can be:
- Stored in databases
- Version controlled in Git
- Processed by custom form systems
- Converted to other formats

---

## Copy from Code Mode

Alternative to the Export button:

1. Switch to **Code** mode
2. Select all JSON text (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)
4. Paste into your destination

Useful for quick copying to clipboard without downloading a file.

---

## Metadata Preservation

When importing SurveyJS schemas, the editor preserves original metadata:

```json
{
  "schemaType": "mieforms-v1.0",
  "title": "Customer Survey",
  "showProgressBar": "top",
  "progressBarType": "questions",
  "completedHtml": "<h3>Thank you!</h3>",
  "fields": [...]
}
```

Properties like `showProgressBar` are maintained through export even though the editor doesn't directly edit them.

---

## Next Steps

- [Importing Forms](/docs/editor/importing) - Import existing schemas
- [Schema Format](/docs/schema-format) - Complete schema reference
- [Renderer Quickstart](/docs/getting-started/quickstart-renderer) - Use exported forms
