# 📝 Questionnaire Builder

FHIR-compatible questionnaire system built with React, Tailwind CSS, and Zustand.

## 📦 Packages

### 🔧 [@mieweb/forms-engine](./packages/forms-engine)
Core state management, field components, and utilities. Includes automatic schema detection and YAML/JSON parsing.

### ✏️ [@mieweb/forms-editor](./packages/forms-editor)
Complete questionnaire editor with conditional logic and SurveyJS import.

### 📋 [@mieweb/forms-renderer](./packages/forms-renderer)
Web Component + React renderer for displaying questionnaires.

## ✨ Features

- Multiple field types (text, longtext, multitext, radio, checkbox, dropdown, boolean, sections)
- **Auto-detection** of schema format (MIE Forms vs SurveyJS)
- **YAML and JSON** parsing support
- Conditional logic with `enableWhen` rules
- FHIR Questionnaire/QuestionnaireResponse export
- Mobile responsive design
- Framework agnostic (Web Component support)
- SurveyJS schema import/conversion
- Hide unsupported field types

## 🛠️ Development

```bash
git clone https://github.com/mieweb/questionnaire-builder.git
cd questionnaire-builder
npm install
npm run dev              # Main editor
npm run dev:demos        # Package demos
npm run build            # Build all packages
```

## 🚀 Quick Start

### Editor (React)
```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

<QuestionnaireEditor 
  initialFormData={[]} 
  onChange={(fields) => console.log(fields)} 
/>
```

### Renderer

**React Component:**
```jsx
import { QuestionnaireRenderer, buildQuestionnaireResponse, useFieldsArray } from '@mieweb/forms-renderer';

function MyForm() {
  const fields = [{ id: 'q1', fieldType: 'text', question: 'Name?', answer: '' }];
  const currentFields = useFieldsArray();

  const handleSubmit = (e) => {
    e.preventDefault();
    const fhir = buildQuestionnaireResponse(currentFields, 'q-1');
  };

  return (
    <form onSubmit={handleSubmit}>
      <QuestionnaireRenderer 
        formData={fields}
        schemaType="mieforms"  // Optional: 'mieforms' or 'surveyjs' (auto-detected)
        hideUnsupportedFields={false}  // Optional: hide unsupported field types
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Web Component:**
```html
<script type="module">
  import '@mieweb/forms-renderer/standalone';
</script>

<questionnaire-renderer></questionnaire-renderer>

<script>
  const renderer = document.querySelector('questionnaire-renderer');
  renderer.formData = [{ id: 'q1', fieldType: 'text', question: 'Name?', answer: '' }];
  
  // Optional: Override auto-detected schema type
  renderer.schemaType = 'mieforms'; // 'mieforms' or 'surveyjs'
  
  // Optional: Hide unsupported field types
  renderer.hideUnsupportedFields = true;
</script>
```

**Blaze/Meteor:**
```javascript
import '@mieweb/forms-renderer/blaze';
```
```handlebars
{{> questionnaireRenderer 
    formData=myFormData 
    schemaType="mieforms"
    hideUnsupportedFields=true}}
```
