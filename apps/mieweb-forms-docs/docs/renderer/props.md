---
sidebar_position: 2
---

# Renderer Props

`QuestionnaireRenderer` is a React component exported from `@mieweb/forms-renderer`.

## Component

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

<QuestionnaireRenderer formData={formData} />
```

## Props

### `formData` (required)

- Type: `string | object`
- Meaning: Questionnaire schema.
- Accepted formats:
  - MIE Forms object (`{ schemaType: 'mieforms-v1.0', fields: [...] }`)
  - SurveyJS object (`{ pages: [...] }`)
  - JSON string
  - YAML string

### `schemaType` (optional)

- Type: `string`
- Values: `'mieforms' | 'surveyjs'`

If omitted, schema type is auto-detected.

### `onChange` (optional)

- Type: `(formData: object) => void`

Called whenever answers change. The payload is the current schema + responses:

```js
{
  schemaType: 'mieforms-v1.0',
  // ...any schema metadata
  fields: [ /* fields including current answers */ ]
}
```

### `hideUnsupportedFields` (optional)

- Type: `boolean`
- Default: `true`

Hides `fieldType: "unsupported"` during rendering.

### `fullHeight` (optional)

- Type: `boolean`
- Default: `false`

Applies a full-height rendering mode.

### `className` (optional)

- Type: `string`

Appends CSS classes on the renderer root container.

### `storeRef` (optional)

- Type: `React.MutableRefObject`

If provided, the renderer sets `storeRef.current` to the internal store instance (advanced usage).

## Related

- [FHIR Export](/docs/renderer/fhir-export)
- [Standalone Web Component](/docs/renderer/web-component)
- [Meteor Blaze](/docs/renderer/blaze)
