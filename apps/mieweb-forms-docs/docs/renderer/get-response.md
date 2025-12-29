---
sidebar_position: 3
---

# Get Response

Use the `onQuestionnaireResponse` prop to receive a FHIR `QuestionnaireResponse` whenever answers change.

If you already have a `fields` array (e.g., from `onChange`), you can also build the response manually using:

```js
buildQuestionnaireResponse(fields, questionnaireId, subjectId)
```

## React usage

Use the `onQuestionnaireResponse` prop to receive a response whenever answers change (returned as a FHIR `QuestionnaireResponse`). This avoids refs:

```jsx
import React from 'react';
import {
  QuestionnaireRenderer,
} from '@mieweb/forms-renderer';

export function MyForm() {
  const formData = {
    schemaType: 'mieforms-v1.0',
    fields: [
      { id: 'name', fieldType: 'text', question: 'Name', answer: '' },
    ],
  };

  const [response, setResponse] = React.useState(null);

  return (
    <div>
      <QuestionnaireRenderer
        formData={formData}
        questionnaireId="my-questionnaire-id"
        subjectId="patient-123"
        onQuestionnaireResponse={setResponse}
      />

      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
```

## Meteor Blaze usage

Use `onQuestionnaireResponse` to capture the response as it changes:

```handlebars
{{> questionnaireRenderer
    formData=currentFormData
    questionnaireId="my-questionnaire-id"
    subjectId="patient-123"
    onQuestionnaireResponse=handleResponse}}
```

```js
import { Template } from 'meteor/templating';
import '@mieweb/forms-renderer/blaze';

Template.myForm.helpers({
  handleResponse() {
    return (response) => {
      console.log(response);
    };
  },
});
```

## Web Component usage

If you’re using the standalone `<questionnaire-renderer>` element, call its built-in method:

```js
const renderer = document.querySelector('questionnaire-renderer');
const fhir = renderer.getQuestionnaireResponse('my-questionnaire-id', 'patient-123');
```

See [Standalone Web Component](/docs/renderer/web-component) for the full API.

## Manual helper usage (advanced)

If you want to build a response from the fields array yourself:

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

  const [latestFields, setLatestFields] = React.useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhir = buildQuestionnaireResponse(latestFields, 'my-questionnaire-id', 'patient-123');
    console.log(fhir);
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer
        formData={formData}
        onChange={(fd) => setLatestFields(fd.fields)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```
