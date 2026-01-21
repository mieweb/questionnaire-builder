---
sidebar_position: 4
---

# Standalone Web Component

The renderer ships a standalone Web Component (React bundled) for framework-agnostic use.

## Install

```bash
npm install @mieweb/forms-renderer
```

## Usage

```html
<questionnaire-renderer></questionnaire-renderer>

<script type="module">
  import '@mieweb/forms-renderer/standalone';

  const el = document.querySelector('questionnaire-renderer');

  el.hideUnsupportedFields = true;
  el.onChange = (updated) => {
    console.log('Updated form data:', updated);
  };

  el.formData = {
    schemaType: 'mieforms-v1.0',
    fields: [
      { id: 'name', fieldType: 'text', question: 'Name', answer: '' }
    ]
  };

  // Later: get QuestionnaireResponse
  // const fhir = el.getQuestionnaireResponse('q-1', 'patient-123');
</script>
```

## Attributes (optional)

These attributes are supported:

- `schema-type` (string)
- `full-height` (boolean attribute)
- `hide-unsupported-fields` (boolean attribute)
- `form-data` (JSON string)
- `theme` (`'light'` | `'dark'`, default: `'light'`)

If you use `form-data`, it must be JSON (not YAML):

```html
<questionnaire-renderer
  form-data='{"schemaType":"mieforms-v1.0","fields":[]}'
  theme="dark"
></questionnaire-renderer>
```

## Properties / methods

- `el.formData` - Set/get schema (object, YAML string, or JSON string)
- `el.schemaType` - Optional schema hint (`'mieforms' | 'surveyjs'`)
- `el.hideUnsupportedFields` - Boolean (default `true`)
- `el.theme` - Theme mode (`'light'` | `'dark'`, default `'light'`)
- `el.onChange` - Callback receiving full `{ schemaType, ...metadata, fields }`
- `el.getQuestionnaireResponse(questionnaireId, subjectId)` - Get a `QuestionnaireResponse`
