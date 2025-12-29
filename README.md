# 📝 Questionnaire Builder

FHIR-compatible questionnaire system for building and rendering dynamic forms.

## 📦 Packages

- **[@mieweb/forms-editor](./packages/forms-editor)** - Visual form builder
- **[@mieweb/forms-renderer](./packages/forms-renderer)** - Display questionnaires
- **[@mieweb/forms-engine](./packages/forms-engine)** - Core state management

## 🚀 Installation

```bash
# For building forms & vieiwng
npm install @mieweb/forms-editor

# For displaying forms & submitting
npm install @mieweb/forms-renderer
```

## 📖 Documentation

**[Full Documentation](https://questionnaire-builder.opensource.mieweb.org/)**

See the complete documentation for:
- Getting started guides
- API reference
- Field types
- Examples and tutorials
- Integration guides

## 🛠️ Development

```bash
git clone https://github.com/mieweb/questionnaire-builder.git
cd questionnaire-builder
npm install
```

### Scripts

```bash
# Build
npm run build              # Build all packages + docs site
npm run build:packages     # Build only packages
npm run build:docs         # Build only docs site

# Development
npm run dev                # Start docs site with package watch mode
npm run dev:demo           # Start demo app with package watch mode (port 3001)

# Publishing
npm run publish            # Interactive publish script

# Other
npm run lint               # Run ESLint
```


The script will:
1. Prompt for package selection (engine, editor, renderer, or all)
2. Ask for version bump type (major, minor, patch)
3. Ask whether to publish to npm (or dry-run)
4. Build, version bump, sync dependencies, and publish

**Important:** When updating packages, remember to update the documentation site (`apps/mieweb-forms-docs`) to reflect any API changes, new features, or breaking changes.

## 📄 License

MIT
