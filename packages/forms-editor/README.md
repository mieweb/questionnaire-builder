# @mieweb/forms-editor

Visual questionnaire builder with three editing modes: Build, Code, and Preview.

## Installation

```bash
npm install @mieweb/forms-editor
```

**Requirements:** React 18+ and React DOM 18+

## Quick Start

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {
  const [formData, setFormData] = React.useState({
    schemaType: 'mieforms-v1.0',
    fields: []
  });

  return (
    <QuestionnaireEditor 
      initialFormData={formData} 
      onChange={setFormData} 
    />
  );
}
```

## Documentation

**[Full Documentation](<link>/docs/editor/overview)**

For detailed information, see:
- [Quick Start Guide](<link>/docs/getting-started/quickstart-editor)
- [Props Reference](<link>/docs/editor/props)
- [Editor Modes](<link>/docs/editor/modes)
- [Field Editing](<link>/docs/editor/field-editing)
- [Import/Export](<link>/docs/editor/importing)

## License

MIT
