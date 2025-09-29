# Main Application

The main application showcases both the **Editor** and **Forms** packages, demonstrating the complete questionnaire workflow from building to filling out forms.

## 🎯 What this demonstrates

### 🛠️ Form Editor Mode
- **Complete form builder interface** with drag-and-drop
- **All field types**: text, radio, checkbox, dropdown, sections  
- **Preview mode** to test forms before deployment
- **Import/Export** functionality for form configurations
- **Mobile-responsive** design with professional UI

### 📝 Form Renderer Mode  
- **End-user form filling experience** 
- **Form submission handling** with data collection
- **Real-time form validation** and interaction
- **Clean, accessible interface** for form completion

## 🚀 Running the demo

```bash
npm run dev
```

Visit the demo and switch between modes using the toggle buttons!

## 💼 Integration Examples

### Editor Package (Form Building)
```jsx
import { FormEditor } from '@questionnaire-builder/editor';

function AdminPanel() {
  return <FormEditor />;
}
```

### Forms Package (Form Filling)
```jsx
import { FormRenderer } from '@questionnaire-builder/forms';
import { useFormStore, useUIApi, useFormApi, useFieldsArray } from '@questionnaire-builder/editor';

function UserForm() {
  const hooks = { useFormStore, useUIApi, useFormApi, useFieldsArray };
  
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Process form submission
  };

  return (
    <FormRenderer 
      hooks={hooks}
      onSubmit={handleSubmit}
      showSubmitButton={true}
      submitButtonText="Submit Form"
    />
  );
}
```

### Complete Workflow Integration
```jsx
import { useState } from 'react';
import { FormEditor, FormRenderer } from '@questionnaire-builder/editor';

function MyApp() {
  const [mode, setMode] = useState('build');
  
  return (
    <div>
      <button onClick={() => setMode(mode === 'build' ? 'fill' : 'build')}>
        Switch to {mode === 'build' ? 'Fill Form' : 'Build Form'}
      </button>
      
      {mode === 'build' ? <FormEditor /> : <FormRenderer />}
    </div>
  );
}
```

## 🎪 Features Showcased

- ✅ **Dual-mode demonstration**: Build forms, then fill them out
- ✅ **Package interoperability**: See how Editor and Forms work together  
- ✅ **Real form submissions**: Complete workflow with data handling
- ✅ **Professional UI**: Clean, modern interface design
- ✅ **Code examples**: Integration patterns for both packages
- ✅ **Responsive design**: Works on desktop and mobile
- ✅ **State management**: Shared state between build/fill modes