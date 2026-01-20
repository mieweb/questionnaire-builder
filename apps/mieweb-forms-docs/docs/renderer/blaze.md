---
sidebar_position: 5
---

# Meteor Blaze Integration

The renderer ships a Blaze wrapper for Meteor apps (React bundled).

## Install

```bash
meteor npm install @mieweb/forms-renderer
```

## Import

```js
import '@mieweb/forms-renderer/blaze';
```

## Template usage

```handlebars
{{> questionnaireRenderer
    formData=currentFormData
    hideUnsupportedFields=true
    theme="auto"
    onChange=handleChange
    onQuestionnaireResponse=handleResponse
    questionnaireId="my-questionnaire-id"
    subjectId="patient-123"}}
```

### Theme Options

- `"auto"` (default) - Auto-detects from document's `data-theme` or `.dark` class
- `"light"` - Forces light theme
- `"dark"` - Forces dark theme
```

## Helper example

```js
import { Template } from 'meteor/templating';

Template.myForm.helpers({
  currentFormData() {
    return {
      schemaType: 'mieforms-v1.0',
      fields: [
        { id: 'q1', fieldType: 'text', question: 'Name?', answer: '' }
      ]
    };
  },
  handleChange() {
    return (updatedFormData) => {
      console.log('Form changed:', updatedFormData);
    };
  },
  handleResponse() {
    return (response) => {
      console.log('QuestionnaireResponse:', response);
    };
  }
});
```
