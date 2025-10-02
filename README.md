
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
# Includes automatic package rebuilding when you edit source code
```

#### **web-demo-packages**
Interactive showcase demonstrating both the editor and renderer packages side-by-side.

- Toggle between Editor and Renderer modes
- See how questionnaires look from both builder and user perspectives
- Test conditional logic and field interactions
- Useful for evaluating which package fits your use case

**Run locally:**
```bash
npm run dev:demos
# Opens the demo at http://localhost:5173
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
npm run dev:demos        # Demo app + package watch mode (http://localhost:5174)
```

**Package Development:**
```bash
npm run dev:packages     # Watch mode for packages only (auto-rebuild on changes)
npm run build            # Build all packages once
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

# Publish without versioning
npm run publish:packages   # Publish all packages as-is
```

### Step-by-Step Workflow

```bash
# 1. Build all packages  
npm run build

# 2. Version what you want to release
npm run version:engine     # or version:all for everything

# 3. Publish
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

### Manual Testing

```bash
# Build and test packages in demo apps
npm run build
npm run dev:demos        # Test in demo app
npm run dev              # Test in web-editor app
```

### External Testing

To test packages in external projects:

```bash
# Build packages
npm run build

# In external project, use file:// protocol
# package.json:
# {
#   "dependencies": {
#     "@mieweb/forms-engine": "file:../questionnaire-builder/packages/forms-engine"
#   }
# }
```

---

## 📄 License

MIT

---
