# 📝 Questionnaire Builder

🔗 [Live Demo](https://mieweb-questionnaire-builder-main.opensource.mieweb.org/)

FHIR-compatible questionnaire system built with React, Tailwind CSS, and Zustand. Build dynamic forms with conditional logic.

## 📦 Packages

### 🔧 [@mieweb/forms-engine](./packages/forms-engine)
Core state management and field components.
```bash
npm install @mieweb/forms-engine
```

### ✏️ [@mieweb/forms-editor](./packages/forms-editor)
Complete questionnaire editor with conditional logic.
```bash
npm install @mieweb/forms-editor
```

### 📋 [@mieweb/forms-renderer](./packages/forms-renderer)
Web Component + React renderer for displaying questionnaires.
```bash
npm install @mieweb/forms-renderer
```

## ✨ Features

- 🔧 Multiple field types (input, radio, checkbox, dropdown, sections)
- 🔀 Conditional logic with `enableWhen` rules
- 🏥 FHIR Questionnaire/QuestionnaireResponse export
- 📱 Mobile responsive
- 🌐 Framework agnostic (Web Component support)
- 🎨 Tailwind CSS styling

## 🛠️ Development

```bash
git clone https://github.com/mieweb/questionnaire-builder.git
cd questionnaire-builder
npm install

# Run main editor
npm run dev

# Run package demos
npm run dev:demos
```

### 🔧 Scripts

```bash
npm run build            # Build all packages
npm run dev:packages     # Watch mode for packages
npm run lint             # ESLint
```

## 🚀 Quick Start

### ✏️ Editor
```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';

function App() {
  const [fields, setFields] = React.useState([]);
  return (
    <QuestionnaireEditor initialFields={fields} onChange={setFields} />
  );
}
```

### 📋 Renderer
```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function App() {
  const fields = [
    { id: 'q1', fieldType: 'input', question: 'Your name?', answer: '' }
  ];
  return (
    <QuestionnaireRenderer
      questionnaireId="demo-1"
      fields={fields}
      onSubmit={(fhirResponse) => console.log(fhirResponse)}
    />
  );
}
```