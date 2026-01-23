---
sidebar_position: 3
---

# Get Response

Use the `ref` prop to get form responses on demand via `ref.current.getResponse()`.

## React Usage

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

## Response Format

`getResponse()` returns the current form state with answers:

```json
{
  "schemaType": "mieforms-v1.0",
  "fields": [
    {
      "id": "name",
      "fieldType": "text",
      "question": "Name",
      "answer": "John Doe"
    },
    {
      "id": "email",
      "fieldType": "text",
      "question": "Email",
      "inputType": "email",
      "answer": "john@example.com"
    }
  ]
}
```

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
