---
sidebar_position: 3
---

# Get Response

There are multiple ways to extract data from a form, depending on your use case.

## Getting Form Responses

### Using `ref.current.getResponse()`

The standard way to get responses from the renderer is via the `ref` prop:

```jsx
import React, { useRef } from 'react';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

export function MyForm() {
  const rendererRef = useRef();

  const formData = {
    schemaType: 'mieforms-v1.0',
    fields: [
      { id: 'name', fieldType: 'text', question: 'Name' },
      { id: 'email', fieldType: 'text', question: 'Email', inputType: 'email' },
    ],
  };

  const handleSubmit = () => {
    const response = rendererRef.current.getResponse();
    console.log('Form response:', response);
    // Send to server, etc.
  };

  return (
    <div>
      <QuestionnaireRenderer ref={rendererRef} formData={formData} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

**Returns (MIE Forms response schema):**

```json
[
  {
    "id": "name",
    "text": "Name",
    "answer": [{ "value": "John Doe" }]
  },
  {
    "id": "email",
    "text": "Email",
    "answer": [{ "value": "john@example.com" }]
  }
]
```

---

## Advanced: Engine-Level Store Hooks

**Note:** These hooks are from `@mieweb/forms-engine` and are only needed when building custom field components or your own renderer. Normal users of `@mieweb/forms-renderer` should use `ref.current.getResponse()` instead.

When building custom components with `@mieweb/forms-engine`, you can access the store directly:

```jsx
import { useFormDefinition, useFormData, useFormResponse } from '@mieweb/forms-engine';

function MyCustomForm() {
  // Get MIE Forms schema (definition only) ✅ Recommended for saving/exporting
  const definition = useFormDefinition();
  // Returns: { schemaType, title, fields: [...] } (no answer/selected)

  // Get MIE Forms schema (complete with responses) - backward compatibility
  const completeData = useFormData();
  // Returns: { schemaType, title, fields: [...] } (includes answer/selected)

  // Get MIE Forms response schema (for submission to backend)
  const responses = useFormResponse();
  // Returns: [{ id, text, answer: [...] }, ...]

  const handleExport = () => {
    // Save clean MIE Forms schema definition without user answers
    saveToFile(definition);
  };

  const handleSubmit = () => {
    // Submit only the responses
    sendToBackend(responses);
  };

  return (
    <div>
      <button onClick={handleExport}>Export Template</button>
      <button onClick={handleSubmit}>Submit Answers</button>
    </div>
  );
}
```

**`useFormDefinition()` returns MIE Forms schema (definition):**
```json
{
  "schemaType": "mieforms-v1.0",
  "title": "Patient Intake",
  "fields": [
    {
      "id": "name",
      "fieldType": "text",
      "question": "Full Name",
      "required": true
    }
  ]
}
```

**`useFormResponse()` returns (MIE Forms response schema):**
```json
[
  {
    "id": "name",
    "text": "Full Name",
    "answer": [{ "value": "John Doe" }]
  },
  {
    "id": "email",
    "text": "Email",
    "answer": [{ "value": "john@example.com" }]
  }
]
```

## Best Practices

**For normal use:**
- Use `ref.current.getResponse()` to get form responses for submission
- The response format is MIE Forms response schema: `[{id, text, answer}]`

**For advanced engine-level development only:**
- Use store hooks (`useFormDefinition`, `useFormData`, `useFormResponse`) when building custom field components or your own renderer
- Not needed for normal forms-renderer or forms-editor usage

---

## Web Component Usage

```html
<questionnaire-renderer id="myForm"></questionnaire-renderer>

<script type="module">
  import '@mieweb/forms-renderer/standalone';

  const el = document.getElementById('myForm');
  el.formData = { schemaType: 'mieforms-v1.0', fields: [...] };

  document.getElementById('submitBtn').addEventListener('click', () => {
    const response = el.getResponse();
    console.log(response);
  });
</script>
```

See [Standalone Web Component](/docs/renderer/web-component) for the full API.

## Meteor Blaze Usage

```js
Template.myForm.onRendered(function() {
  // The template instance exposes getResponse()
});

Template.myForm.events({
  'click .submit-btn'(event, templateInstance) {
    const response = templateInstance.getResponse();
    console.log('Form response:', response);
  }
});
```

See [Meteor Blaze](/docs/renderer/blaze) for the full API.
