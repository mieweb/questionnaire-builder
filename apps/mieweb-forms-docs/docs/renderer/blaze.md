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

## Template Usage

```handlebars
{{> questionnaireRenderer
    formData=currentFormData
    hideUnsupportedFields=true
    theme="light"}}
```

### Theme Options

- `"light"` (default) - Light theme
- `"dark"` - Dark theme

## Helper Example

```js
import { Template } from 'meteor/templating';

Template.myForm.helpers({
  currentFormData() {
    return {
      schemaType: 'mieforms-v1.0',
      fields: [
        { id: 'q1', fieldType: 'text', question: 'Name?' }
      ]
    };
  }
});
```

## Getting Response

The template instance exposes a `getResponse()` method:

```js
Template.myForm.events({
  'click .submit-btn'(event, templateInstance) {
    const response = templateInstance.getResponse();
    console.log('Form response:', response);
    // Send to server, etc.
  }
});
```
