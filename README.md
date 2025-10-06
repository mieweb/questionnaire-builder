
---

# 📝 Questionnaire Builder

🔗 [Live Demo](https://mieweb-questionnaire-builder-main.opensource.mieweb.org/)

A modular, FHIR-compatible questionnaire system built with **React**, **Tailwind CSS**, and **Zustand**. Build dynamic forms with conditional logic and export to [FHIR Questionnaire](https://hl7.org/fhir/questionnaire.html) format.

---

## 📦 Packages

This monorepo contains three npm packages for building and rendering questionnaires:

### [@mieweb/forms-engine](./packages/forms-engine) `v0.1.5`
Core state management, field components, and utilities for building custom questionnaire UIs.

```bash
npm install @mieweb/forms-engine
```

**Use when:** Building custom questionnaire UIs or need low-level field primitives and state management.

### [@mieweb/forms-editor](./packages/forms-editor) `v0.1.4`
Full-featured questionnaire editor with FHIR export and conditional logic.

```bash
npm install @mieweb/forms-editor
```

**Use when:** You need a complete editor UI for creating and managing questionnaires.

### [@mieweb/forms-renderer](./packages/forms-renderer) `v0.1.5`
Read-only renderer for displaying questionnaires and collecting responses with FHIR output.

```bash
npm install @mieweb/forms-renderer
```

**Use when:** Displaying questionnaires to end users (patients, survey respondents, etc.).

---

## ✨ Features

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
│   ├── forms-engine/      # Core primitives & state management
│   ├── forms-editor/      # Full editor component
│   └── forms-renderer/    # Read-only form renderer
└── apps/
    ├── web-editor/        # Production application (deployed)
    └── web-demo-packages/ # Demo showcase (development/testing)
```

### Demo Applications

#### **web-editor** - Main Application
The production questionnaire editor application built with `@mieweb/forms-editor`. This is the main deployed application available at the live demo URL.

- Full-featured editor interface with toolbar and preview
- Import/export functionality (JSON, YAML, FHIR)
- Conditional logic editor with enableWhen support
- Mobile-responsive design with optimized layouts
- Reference implementation for integrating the editor package

**Run locally:**
```bash
npm run dev
# Opens the editor at http://localhost:5173
# Includes automatic package rebuilding when you edit source code
```

#### **web-demo-packages** - Demo Showcase
Interactive demo application for exploring and comparing both the editor and renderer packages.

- Navigate between Editor and Renderer modes
- See how questionnaires look from both builder and user perspectives
- Test conditional logic and field interactions
- Useful for evaluating which package fits your use case
- Demo only - not for production deployment

**Run locally:**
```bash
npm run dev:demos
# Opens the demo at http://localhost:5180
# Includes automatic package rebuilding when you edit source code
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

# Start development (with auto-rebuilding packages)
npm run dev              # Web-editor with package watch mode
npm run dev:demos        # Demo app with package watch mode
```

### Development Scripts

**Main Development:**
```bash
npm run dev              # Web-editor + package watch mode (http://localhost:5173)
npm run dev:demos        # Demo app + package watch mode (http://localhost:5180)
```

**Package Development:**
```bash
npm run dev:packages     # Watch mode for packages only (auto-rebuild on changes)
npm run build            # Build all packages once
npm run lint             # Run ESLint on all files
npm run preview          # Preview built web-editor app
```

### Build System

Built with **Vite** and **vite-plugin-lib-inject-css** for optimal bundling:

- ✅ **Automatic CSS bundling** - Tailwind styles are injected directly into JavaScript
- ✅ **Tree-shaking** - Only used utilities are included  
- ✅ **Source maps** - Full debugging support
- ✅ **ESM format** - Modern module system
- ✅ **Watch mode** - Packages auto-rebuild when source changes

**What gets built:**
- `dist/index.js` - JavaScript bundle with CSS automatically injected
- `dist/index.js.map` - Source maps for debugging
- No manual CSS imports needed by consumers!

---

## 📤 Publishing Packages

### Prerequisites

```bash
# Login to npm with @mieweb org access
npm login
```

### Individual Package Releases

```bash
# Release individual packages (build + version + publish)
npm run release:engine     # forms-engine only
npm run release:editor     # forms-editor only  
npm run release:renderer   # forms-renderer only
```

### Release All Packages

```bash
npm run release:all        # Build + version + publish all packages
```

### Manual Version Control

```bash
# Version individual packages (patch only: 0.1.1 → 0.1.2)
npm run version:engine     # forms-engine only
npm run version:editor     # forms-editor only
npm run version:renderer   # forms-renderer only
npm run version:all        # all packages

# Sync dependencies (updates cross-package references)
npm run sync-deps          # sync all
npm run sync-deps:editor   # forms-editor dependencies only
npm run sync-deps:renderer # forms-renderer dependencies only

# Publish without versioning
npm run publish:packages   # Publish all packages as-is
```

### Step-by-Step Workflow

```bash
# 1. Build all packages  
npm run build

# 2. Version what you want to release
npm run version:engine     # or version:all for everything

# 3. Sync dependencies (updates package.json cross-references)
npm run sync-deps

# 4. Publish
npm run publish:packages

# 5. Push commits and tags
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
import { createRoot } from 'react-dom/client';

function App() {
  const [fields, setFields] = React.useState([]);

  return (
    <div className="absolute inset-0 overflow-auto">
      <QuestionnaireEditor
        initialFields={fields}
        onChange={setFields}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
```

### Renderer

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

function App() {
  const [fields] = React.useState([
    { id: 'q1', fieldType: 'input', question: 'Your name?', answer: '' }
  ]);

  return (
    <div className="absolute inset-0 overflow-auto p-4">
      <QuestionnaireRenderer
        questionnaireId="demo-1"
        fields={fields}
        onSubmit={(fhirResponse) => console.log(fhirResponse)}
      />
    </div>
  );
}
```

---

## 🧪 Testing

### Manual Testing

```bash
# Build and test packages in demo apps
npm run build
npm run dev:demos        # Test in demo app
npm run dev              # Test in web-editor app
```

### External Testing

To test packages in external projects without publishing:

```bash
# 1. Build and pack the packages
npm run build

cd packages/forms-engine
npm pack
# Creates: mieweb-forms-engine-0.1.5.tgz

cd ../forms-renderer
npm pack
# Creates: mieweb-forms-renderer-0.1.5.tgz

# 2. In your external project, install from the .tgz files
cd /path/to/your/external/project
npm install /path/to/questionnaire-builder/packages/forms-engine/mieweb-forms-engine-0.1.5.tgz
npm install /path/to/questionnaire-builder/packages/forms-renderer/mieweb-forms-renderer-0.1.5.tgz

# 3. Clean up .tgz files when done
cd /path/to/questionnaire-builder/packages
Get-ChildItem -Recurse -Filter *.tgz | Remove-Item  # PowerShell
# or
find . -name "*.tgz" -delete  # Bash/Unix
```

---

## 📄 License

MIT

---
