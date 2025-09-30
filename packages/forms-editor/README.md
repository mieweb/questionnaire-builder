## @mieweb/forms-editor

Embeddable questionnaire form builder UI built on top of `@mieweb/forms-engine`.

### Install

Ensure the engine is already installed (it is a dependency).

```
npm install @mieweb/forms-editor
```

### Basic Usage

```jsx
import React from 'react';
import { QuestionnaireEditor } from '@mieweb/forms-editor';

export default function Demo() {
  const [fields, setFields] = React.useState([
    { id: 'name', fieldType: 'input', question: 'Your Name' },
  ]);

  return (
    <div style={{ height: '100vh' }}>
      <QuestionnaireEditor
        initialFields={fields}
        onChange={(next) => setFields(next)}
        mode="edit"
      />
    </div>
  );
}
```

### Props

- `initialFields: Field[]` – starting field definitions (array). Ignored after mount if `mode="edit"` and you keep editing in-place.
- `onChange?: (fields: Field[]) => void` – called whenever the underlying form changes.
- `mode?: 'edit' | 'preview'` – preview hides the editing chrome.
- `className?: string` – optional wrapper class.

### Event Frequency
`onChange` fires on every structural change. Wrap with `useCallback` + debounce if persisting remotely.

### Migrating From Previous App Bootstrap
The old `App.jsx` and `main.jsx` have been replaced with a stub export. Embed the component inside your consuming app instead (see `apps/web-editor`).

### License
Internal / TBD
