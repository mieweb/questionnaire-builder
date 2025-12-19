# @mieweb/forms-engine

Core state management and field components for FHIR-compatible questionnaires.

⚠️ **Note:** This package is primarily used internally by `@mieweb/forms-editor` and `@mieweb/forms-renderer`. Most users should use those packages instead.

## Installation

```bash
npm install @mieweb/forms-engine
```

**Requirements:** React 18+ and React DOM 18+

## Overview

Provides:
- 20+ field components
- Zustand state management
- Schema utilities (YAML/JSON parsing, auto-detection)
- Conditional logic evaluation

## Quick Start

```jsx
import { 
  FormStoreContext, 
  UIStoreContext,
  createFormStore, 
  createUIStore,
  Text_Field 
} from '@mieweb/forms-engine';

function MyApp() {
  const formStore = React.useRef(createFormStore()).current;
  const uiStore = React.useRef(createUIStore()).current;

  React.useEffect(() => {
    formStore.getState().replaceAll({
      schemaType: 'mieforms-v1.0',
      fields: [
        { id: 'name', fieldType: 'text', question: 'Name?', answer: '' }
      ]
    });
  }, [formStore]);

  return (
    <FormStoreContext.Provider value={formStore}>
      <UIStoreContext.Provider value={uiStore}>
        <Text_Field fieldId="name" />
      </UIStoreContext.Provider>
    </FormStoreContext.Provider>
  );
}
```

## Documentation

**[Full Documentation](<link>)**

For detailed information, see:
- [Field Types](<link>/docs/field-types)
- [Schema Format](<link>/docs/schema-format)
- [Conditional Logic](<link>/docs/conditional-logic)

## License

MIT
