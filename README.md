# 📝 Questionnaire Builder

FHIR-compatible questionnaire system built with React, Tailwind CSS, and Zustand.

## 📦 Packages

### 🔧 [@mieweb/forms-engine](./packages/forms-engine)
Core state management and field components.

### ✏️ [@mieweb/forms-editor](./packages/forms-editor)
Complete questionnaire editor with conditional logic.

### 📋 [@mieweb/forms-renderer](./packages/forms-renderer)
Web Component + React renderer for displaying questionnaires.

## ✨ Features

- Multiple field types (text, longtext, multitext, radio, checkbox, dropdown, boolean, sections)
- Conditional logic with `enableWhen` rules
- FHIR Questionnaire/QuestionnaireResponse export
- Mobile responsive design
- Framework agnostic (Web Component support)
- SurveyJS schema import/conversion
- Hide unsupported field types
- Automatic CSS injection (no manual imports needed)

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
  initialFields={[]} 
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
        fields={fields}
        schemaType="inhouse"
        hideUnsupportedFields={false}
        onChange={(updated) => console.log(updated)}
        fullHeight={false}
        className=""
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

<form id="form">
  <questionnaire-renderer></questionnaire-renderer>
  <button type="submit">Submit</button>
</form>

<script>
  const renderer = document.querySelector('questionnaire-renderer');
  
  renderer.fields = [{ id: 'q1', fieldType: 'text', question: 'Name?', answer: '' }];
  renderer.schemaType = 'inhouse'; // or 'surveyjs'
  renderer.hideUnsupportedFields = false;
  renderer.onChange = (updated) => console.log(updated);
  
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fhir = renderer.getQuestionnaireResponse('q-1');
  });
</script>
```

**Blaze/Meteor:**
```javascript
// Client code
import '@mieweb/forms-renderer/blaze';
```
```handlebars
{{> questionnaireRenderer 
    fields=myFields 
    schemaType="inhouse"
    hideUnsupportedFields=false
    fullHeight=false
    onChange=handleChange}}
```