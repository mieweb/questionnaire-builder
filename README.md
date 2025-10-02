
---

# 📝 Questionnaire Builder

🔗 [Live Demo](https://mieweb-questionnaire-builder-main.opensource.mieweb.org/)

A modular, FHIR-compatible questionnaire system built with **React**, **Tailwind CSS**, and **Zustand**. Build dynamic forms with conditional logic and export to [FHIR Questionnaire](https://hl7.org/fhir/questionnaire.html) format.

---

## � Packages

This monorepo contains three npm packages for building and rendering questionnaires:

### [@mieweb/forms-engine](./packages/forms-engine)
Core state management, field components, and utilities.

```bash
npm install @mieweb/forms-engine
```

**Use when:** Building custom questionnaire UIs or need low-level field primitives.

### [@mieweb/forms-editor](./packages/forms-editor)
Full-featured questionnaire editor with FHIR export and conditional logic.

```bash
npm install @mieweb/forms-editor
```

**Use when:** You need a complete editor UI for creating questionnaires.

### [@mieweb/forms-renderer](./packages/forms-renderer)
Read-only renderer for displaying and filling out questionnaires.

```bash
npm install @mieweb/forms-renderer
```

**Use when:** Displaying questionnaires to end users (patients, survey respondents, etc.).

---

## � Features

- ✅ **Multiple field types** - Input, radio, checkbox, dropdown, sections
- 🔀 **Conditional logic** - Show/hide fields with `enableWhen` rules
- 🏥 **FHIR compatible** - Export to FHIR Questionnaire/QuestionnaireResponse
- 📱 **Mobile responsive** - Works on desktop and mobile devices
- 🎨 **Customizable** - Tailwind CSS styling with override support
- 📊 **State management** - Zustand-based for performance and simplicity

---

## 🏗️ Monorepo Structure

```
questionnaire-builder/
├── packages/
│   ├── forms-engine/      # Core primitives (52 KB)
│   ├── forms-editor/      # Editor component (48 KB)
│   └── forms-renderer/    # Renderer component (5 KB)
└── apps/
    ├── web-editor/        # Full-featured editor demo app
    └── web-demo-packages/ # Package showcase with mode selector
```

### Demo Applications

#### **web-editor**
A complete questionnaire editor application built with `@mieweb/forms-editor`. Use this as a reference for integrating the editor into your own projects.

- Full editor interface with toolbar and preview
- Import/export functionality (JSON, YAML, FHIR)
- Conditional logic editor
- Mobile-responsive design

**Run locally:**
```bash
npm run dev
# Opens the editor at http://localhost:5173
```

#### **web-demo-packages**
Interactive showcase demonstrating both the editor and renderer packages side-by-side.

- Toggle between Editor and Renderer modes
- See how questionnaires look from both builder and user perspectives
- Test conditional logic and field interactions
- Useful for evaluating which package fits your use case

**Run locally:**
```bash
npm run dev
# Opens the demo at http://localhost:5174
```

---

## 🛠️ Development

### Setup

```bash
# Clone the repository
git clone https://github.com/mieweb/questionnaire-builder.git
cd questionnaire-builder

# Install dependencies
npm install

# Run demo apps
npm run dev
```

### Build Packages

```bash
# Build all packages
npm run build:packages

# Build specific package
npm run build --workspace=packages/forms-engine
```

---

## 📤 Publishing Packages

### Prerequisites

```bash
# Login to npm with @mieweb org access
npm login
```

### Full Release Workflow

```bash
npm run release:patch   # 0.1.0 → 0.1.1 (bug fixes)
npm run release:minor   # 0.1.0 → 0.2.0 (new features)
npm run release:major   # 0.1.0 → 1.0.0 (breaking changes)
```

This runs: **build** → **version bump** → **publish** → ready for `git push --tags`

### Step-by-Step (Advanced)

```bash
# 1. Build all packages
npm run build:packages

# 2. Bump version (patch/minor/major)
npm run version:patch

# 3. Publish to npm
npm run publish:packages

# 4. Push commits and tags
git push && git push --tags
```

---

## 📖 Documentation

Each package has detailed documentation:

- [**forms-engine** README](./packages/forms-engine/README.md) - API reference, hooks, utilities
- [**forms-editor** README](./packages/forms-editor/README.md) - Props, features, examples
- [**forms-renderer** README](./packages/forms-renderer/README.md) - Usage, FHIR output, examples

---

## 🎯 Quick Start Examples

### Editor

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import '@mieweb/forms-editor/styles.css';

function App() {
  return (
    <QuestionnaireEditor
      onChange={(fields) => console.log(fields)}
    />
  );
}
```

### Renderer

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';
import '@mieweb/forms-engine/styles.css';

function App({ fields }) {
  return (
    <QuestionnaireRenderer
      fields={fields}
      onSubmit={(fhirResponse) => console.log(fhirResponse)}
    />
  );
}
```

---

## 🧪 Testing

```bash
# Run tests (if configured)
npm test
```

---

## 📄 License

MIT

---
