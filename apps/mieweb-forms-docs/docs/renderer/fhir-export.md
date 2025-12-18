---
sidebar_position: 3
---

# FHIR Export (QuestionnaireResponse)

The renderer package exports a helper:

```js
buildQuestionnaireResponse(fields, questionnaireId, subjectId)
```

It converts the current field array (including answers) into a FHIR `QuestionnaireResponse`.

## React usage

Use the `storeRef` prop to access the renderer store and export the current field array:

```jsx
import React from 'react';
import {
  QuestionnaireRenderer,
  buildQuestionnaireResponse,
} from '@mieweb/forms-renderer';

export function MyForm() {
  const formData = {
    schemaType: 'mieforms-v1.0',
    fields: [
      { id: 'name', fieldType: 'text', question: 'Name', answer: '' },
    ],
  };

  const storeRef = React.useRef(null);

  const onExport = () => {
    const state = storeRef.current?.getState?.();
    if (!state) return;
    const fields = state.order.map((id) => state.byId[id]);
    const fhir = buildQuestionnaireResponse(fields, 'my-questionnaire-id', 'patient-123');
    console.log(fhir);
  };

  return (
    <div>
      <QuestionnaireRenderer formData={formData} storeRef={storeRef} />
      <button type="button" onClick={onExport}>Export FHIR</button>
    </div>
  );
}
```

## Web Component usage

If you’re using the standalone `<questionnaire-renderer>` element, call its built-in method:

```js
const renderer = document.querySelector('questionnaire-renderer');
const fhir = renderer.getQuestionnaireResponse('my-questionnaire-id', 'patient-123');
```

See [Standalone Web Component](/docs/renderer/web-component) for the full API.
