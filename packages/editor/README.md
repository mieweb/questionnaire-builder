# Editor Package

This package provides a complete form editor application with state management, UI components, and utilities.

## What's included

- **FormEditor**: Complete form building application (recommended)
- **Individual components**: For custom implementations
- **State management**: Zustand-based stores and hooks
- **Utilities**: Visibility checking, FHIR export, etc.

## Usage

### Simple integration (recommended)
```jsx
import { FormEditor } from '@questionnaire-builder/editor';

function App() {
  return <FormEditor />;
}
```

### Custom implementation
```jsx
import { 
  FormBuilderEditor,
  EditorLayout, 
  useFormStore,
  useUIApi 
} from '@questionnaire-builder/editor';

function CustomEditor() {
  const formStore = useFormStore();
  const ui = useUIApi();
  
  return (
    <div>
      {/* Your custom UI */}
      <EditorLayout hooks={{ useFormStore, useUIApi }} />
    </div>
  );
}
```

## Architecture

This package contains:
- `/components/` - UI components
- `/state/` - Zustand stores and hooks
- `/utils/` - Utility functions
- `FormEditor.jsx` - Complete application component

## Dependencies

- React 18+
- Zustand (state management)
- Framer Motion (animations)
- UUID (unique IDs)
- js-yaml (YAML processing)