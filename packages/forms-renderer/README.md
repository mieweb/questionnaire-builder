# @mieweb/forms-renderer

Read-only / answer capture questionnaire renderer producing a flat FHIR `QuestionnaireResponse`.

## Install

```bash
npm install @mieweb/forms-renderer @mieweb/forms-engine
```

Peer dependencies (not auto-installed): `react`, `react-dom` (>=18).

## Usage

```jsx
import React from 'react';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';
import '@mieweb/forms-engine/styles.css'; // shared styles

const fields = [
  { id: 'sec-1', fieldType: 'section', title: 'Section', fields: [
    { id: 'q1', fieldType: 'input', question: 'Your name?' }
  ]},
  { id: 'q2', fieldType: 'radio', question: 'Pick one', options: [ { value: 'A' }, { value: 'B' } ] }
];

export default function Demo() {
  return (
    <QuestionnaireRenderer
      questionnaireId="demo-1"
      fields={fields}
      onSubmit={(qr) => console.log(qr)}
    />
  );
}
```

`onSubmit` receives a FHIR-like object:

```json
{
  "resourceType": "QuestionnaireResponse",
  "questionnaire": "demo-1",
  "status": "in-progress",
  "item": [
    { "linkId": "q1", "text": "Your name?", "answer": [{ "valueString": "Alice" }] }
  ]
}
```

## Notes
- Children of a section are flattened into `item` entries.
- Visibility logic (enableWhen) respected if defined.
- Unanswered questions emit empty `answer` arrays.

## Roadmap
- (Optional) hierarchical `item` nesting for sections.
- (Optional) questionnaire metadata mapping.
