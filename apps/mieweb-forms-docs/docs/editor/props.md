---
sidebar_position: 2
---

# Editor Props

`QuestionnaireEditor` is a React component exported from `@mieweb/forms-editor`.

## Component

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

<QuestionnaireEditor />
```

## Props

### `initialFormData` (optional)

- Type: `string | object`
- Meaning: Initial questionnaire schema.
- Accepted formats:
  - MIE Forms object (`{ schemaType: 'mieforms-v1.0', fields: [...] }`)
  - SurveyJS object (`{ pages: [...] }`)
  - JSON string
  - YAML string

If omitted, the editor starts with an empty questionnaire.

### `schemaType` (optional)

- Type: `string`
- Values: `'mieforms' | 'surveyjs'`

If provided along with `initialFormData`, it’s used as a hint when parsing/importing. If omitted, the editor auto-detects the schema type.

### `onChange` (optional)

- Type: `(formData: object) => void`

Called whenever the questionnaire changes. The payload shape is:

```js
{
  schemaType: 'mieforms-v1.0',
  // ...any schema metadata
  fields: [ /* normalized fields */ ]
}
```

### `startInPreview` (optional)

- Type: `boolean`
- Default: `false`

Starts the editor in Preview mode.

### `hideUnsupportedFields` (optional)

- Type: `boolean`
- Default: `false`

Hides `fieldType: "unsupported"` fields in the UI.

### `showHeader` (optional)

- Type: `boolean`
- Default: `true`

Shows/hides the built-in header.

### `className` (optional)

- Type: `string`

Appends CSS classes on the editor root container.

### `theme` (optional)

- Type: `'light' | 'dark'`
- Default: `'light'`

Controls the color theme. Pass dynamically from parent to switch themes.

See [Theming](/docs/getting-started/theming) for customization options.

## Notes

- Import/parsing happens only on initial mount (or when `initialFormData` changes before initialization completes).
- When importing SurveyJS, the editor keeps a conversion report in the UI so you can see what was converted and what was skipped.
