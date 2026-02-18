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
  - **MIE Forms schema (definition)** - Recommended: `{ schemaType: 'mieforms-v1.0', fields: [...] }` — clean schema without answers
  - **MIE Forms schema (complete)** - Backward compatibility: `{ schemaType: 'mieforms-v1.0', fields: [...] }` — includes `answer`/`selected` properties for pre-filled forms
  - **SurveyJS schema**: `{ pages: [...] }` (auto-converted)
  - JSON string (auto-parsed)
  - YAML string (auto-parsed)

**Best practice:** Pass MIE Forms schema definition from the editor. The renderer will initialize empty answers for users to fill in. Pass complete schema (with responses) only when you need pre-filled forms.

### `schemaType` (optional)

- Type: `string`
- Values: `'mieforms' | 'surveyjs'`

If omitted, schema type is auto-detected from the data structure. This prop helps the renderer identify which schema format to expect.

### `ref` (optional)

- Type: `React.Ref`

Exposes a `getResponse()` method to retrieve form responses in MIE Forms response schema format:

```jsx
const rendererRef = useRef();

<QuestionnaireRenderer ref={rendererRef} formData={formData} />

// Later, when you want the response:
const response = rendererRef.current.getResponse();
// Returns MIE Forms response schema: [{id, text, answer: [...]}, ...]
```

See [Get Response](/docs/renderer/get-response) for full usage examples and format details.

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
