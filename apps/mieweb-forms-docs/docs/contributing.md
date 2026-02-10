---
sidebar_position: 9
---

# Contributing

Thank you for your interest in contributing to Questionnaire Builder! We welcome contributions from the community.

## 📋 Quick Links

- **[Full Contributing Guide](https://github.com/mieweb/questionnaire-builder/blob/main/.github/CONTRIBUTING.md)** - Detailed guidelines
- **[GitHub Repository](https://github.com/mieweb/questionnaire-builder)** - Source code
- **[Issues](https://github.com/mieweb/questionnaire-builder/issues)** - Bug reports and feature requests

## 🎯 Core Principles

All contributions should follow these principles:

- **KISS** - Keep it simple and stupid
- **DRY** - Don't repeat yourself (extract helpers when truly needed)
- **YAGNI** - You aren't gonna need it (no speculative features)
- **Minimal Diff** - Change as little code as possible
- **Consistency** - Match existing patterns and naming

## 🚀 Quick Start

### Setup

```bash
# Clone the repository
git clone https://github.com/mieweb/questionnaire-builder.git
cd questionnaire-builder

# Install dependencies
npm install

# Build packages
npm run build:packages

# Start development
npm run dev:demo
```

### Making Changes

1. Create a feature branch with ticket number (`feature/123-your-feature-name`)
2. Make your changes following existing patterns
3. Test locally (`npm run dev` or `npm run dev:demo`)
4. Run linter (`npm run lint`)
5. Commit with clear messages
6. Open a pull request

**Branch naming format**: `<type>/<ticket-number>-<short-description>`  
Example: `feature/456-add-conditional-logic`, `fix/789-renderer-crash`

## 📦 Package Structure

### [@mieweb/forms-engine](https://www.npmjs.com/package/@mieweb/forms-engine)
Internal package - shared state management and utilities. Changes here affect both editor and renderer.

### [@mieweb/forms-editor](https://www.npmjs.com/package/@mieweb/forms-editor)
Visual form builder. Public API changes require documentation updates.

### [@mieweb/forms-renderer](https://www.npmjs.com/package/@mieweb/forms-renderer)
Form display component. Public API changes require documentation updates.

:::tip Documentation Updates
When changing `forms-editor` or `forms-renderer` public APIs, remember to update this documentation site!
:::

## 🎨 Code Style

### React Components

- Use functional components with hooks
- Keep components focused and small
- Extract helpers only when needed in multiple places

### Tailwind CSS

All utility classes **must** use the `mie:` prefix:

```jsx
// ❌ Bad - missing prefix
<div className="flex gap-2 p-4 bg-white">

// ✅ Good - with mie: prefix
<div className="mie:flex mie:gap-2 mie:p-4 mie:bg-miesurface">
```

### Semantic Colors

Always use semantic color variables instead of hardcoded colors:

- `mieprimary` - Primary actions, selected states
- `miedanger` - Errors, destructive actions
- `mieaccent` - Success states
- `miesurface` - Card backgrounds
- `mietext` - Primary text
- `mieborder` - Borders

```jsx
// ❌ Bad - hardcoded colors
<button className="mie:bg-blue-500 mie:text-white">

// ✅ Good - semantic colors
<button className="mie:bg-mieprimary mie:text-mietextsecondary">
```

### Semantic Class Names

Add descriptive class names before Tailwind utilities:

```jsx
// ❌ Bad - Tailwind only
<div className="mie:flex mie:gap-2 mie:p-4">

// ✅ Good - semantic name first
<div className="tool-selector mie:flex mie:gap-2 mie:p-4">
```

## ✅ Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows core principles (KISS, DRY, YAGNI, Minimal Diff)
- [ ] Changes tested locally in dev environment
- [ ] No linting errors (`npm run lint`)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains what changed and why
- [ ] Related issues are linked
- [ ] Documentation updated if API changed

## 🐛 Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment (browser, Node version)
- Screenshots or code samples

### Feature Requests

Include:
- Use case and problem being solved
- Proposed solution
- Why this fits the project scope

## 📚 Additional Resources

- [Installation Guide](./getting-started/installation.md)
- [Renderer API](./renderer/props.md)
- [Editor API](./editor/props.md)
- [Schema Format](./schema-format.md)

## 💬 Get Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and discussions
- **Documentation** - Check these docs first!

---

Thank you for contributing! 🎉
