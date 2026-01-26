---
sidebar_position: 2
---

# Renderer Props

`QuestionnaireRenderer` is a React component exported from `@mieweb/forms-renderer`.

## Component

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

<QuestionnaireRenderer 
  ref={rendererRef}
  formData={formData}             // object | JSON string | YAML string (required)
  schemaType="mieforms"           // "mieforms" | "surveyjs" (auto-detected if omitted)
  theme="light"                   // "light" | "dark"
  className="my-form"             // additional CSS classes
  hideUnsupportedFields={true}    // hide unsupported field types (default: true)
/>
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

### `ref` (optional)

- Type: `React.Ref`

Exposes a `getResponse()` method to retrieve form responses on demand:

```jsx
const rendererRef = useRef();

<QuestionnaireRenderer ref={rendererRef} formData={formData} />

// Later, when you want the response:
const response = rendererRef.current.getResponse();
```

See [Get Response](/docs/renderer/get-response) for full usage examples.

### `hideUnsupportedFields` (optional)

- Type: `boolean`
- Default: `true`

Hides `fieldType: "unsupported"` during rendering.

### `className` (optional)

- Type: `string`

Appends CSS classes on the renderer root container.

### `theme` (optional)

- Type: `'light' | 'dark'`
- Default: `'light'`

Controls the color theme. Pass dynamically from parent to switch themes.

See [Theming](/docs/getting-started/theming) for customization options.

## Related

- [Get Response](/docs/renderer/get-response)
- [Standalone Web Component](/docs/renderer/web-component)
- [Meteor Blaze](/docs/renderer/blaze)
