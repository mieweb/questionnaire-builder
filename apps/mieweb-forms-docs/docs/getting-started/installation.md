# Installation

MIE Forms is published as separate npm packages depending on your needs.

## Choose Your Package

### Forms Renderer

Display questionnaires and collect user responses:

```bash
npm install @mieweb/forms-renderer
```

Supports **React**, **standalone HTML/JS**, and **Meteor/Blaze** integrations - see [Renderer Quickstart](/docs/getting-started/quickstart-renderer) for usage examples.

### Forms Editor

Build and edit questionnaires with a visual editor:

```bash
npm install @mieweb/forms-editor
```

### Forms Engine

Direct access to the core engine for custom implementations:

```bash
npm install @mieweb/forms-engine
```

## Requirements

- **Node.js**: Version 18.0 or higher
- **React**: Version 18.0 or higher (must be installed in your project)
- **React DOM**: Version 18.0 or higher (must be installed in your project)

## Verify Installation

After installation, verify everything works:

```jsx
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';
// or
import { QuestionnaireEditor } from '@mieweb/forms-editor';
```

If imports work without errors, you're ready to go!

## Next Steps

- [Renderer Quick Start](/docs/getting-started/quickstart-renderer) - Start rendering forms
- [Editor Quick Start](/docs/getting-started/quickstart-editor) - Start building form editors
