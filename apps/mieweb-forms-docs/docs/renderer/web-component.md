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
<questionnaire-renderer id="myForm"></questionnaire-renderer>
<button id="submitBtn">Submit</button>

<script type="module">
  import '@mieweb/forms-renderer/standalone';

  const el = document.getElementById('myForm');

  el.hideUnsupportedFields = true;
  el.formData = {
    schemaType: 'mieforms-v1.0',
    fields: [
      { id: 'name', fieldType: 'text', question: 'Name' }
    ]
  };

  // Get response on submit
  document.getElementById('submitBtn').addEventListener('click', () => {
    const response = el.getResponse();
    console.log('Form response:', response);
  });
</script>
```

## Attributes (optional)

These attributes are supported:

- `schema-type` (string)
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

## Properties / Methods

- `el.formData` - Set/get schema (object, YAML string, or JSON string)
- `el.schemaType` - Optional schema hint (`'mieforms' | 'surveyjs'`)
- `el.hideUnsupportedFields` - Boolean (default `true`)
- `el.theme` - Theme mode (`'light'` | `'dark'`, default `'light'`)
- `el.getResponse()` - Get the current form response
