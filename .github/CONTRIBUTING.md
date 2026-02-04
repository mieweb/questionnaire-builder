# Contributing to Questionnaire Builder

Thank you for your interest in contributing! This guide will help you get started with contributing to the questionnaire-builder project.

## 🎯 Core Principles

All code contributions should follow these guiding principles:

- **KISS (Keep It Simple & Stupid)** - Prefer the simplest working solution
- **DRY (Don't Repeat Yourself)** - Extract helpers only when repetition is real (≥2 places)
- **YAGNI (You Aren't Gonna Need It)** - No speculative features or abstractions
- **Minimal Diff** - Change as little code as possible to solve the problem
- **Consistency Over Cleverness** - Match existing patterns, naming, and structure

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)
- Git

### Fork or Branch?

- **External contributors**: Fork the repository and work on feature branches in your fork
- **Internal contributors**: Work directly on feature branches in the main repository

### Local Setup

```bash
# Clone the repository (or your fork)
git clone https://github.com/mieweb/questionnaire-builder.git
cd questionnaire-builder

# Install dependencies
npm install

# Build all packages
npm run build:packages

# Start development
npm run dev:demo
```

## 📝 Development Workflow

### Branch Naming

Use descriptive branch names that include the ticket number and name:

- `feature/123-add-date-picker` - New features
- `fix/456-validation-error` - Bug fixes
- `docs/789-update-renderer-api` - Documentation updates
- `refactor/101-simplify-state` - Code refactoring

Format: `<type>/<ticket-number>-<short-description>`

### Commit Messages

Write clear, concise commit messages:

- Use imperative mood: "Add feature" not "Added feature"
- Keep first line under 72 characters
- Provide context in the body if needed

```
Add conditional logic support for radio fields

- Implement show/hide logic based on selected value
- Update schema validation to support conditions
- Add tests for conditional rendering
```

### Code Style

- **React & JSX**: Functional components with hooks
- **Tailwind CSS**: All utility classes MUST use `mie:` prefix (e.g., `mie:flex`, `mie:p-4`)
- **Semantic Colors**: Always use semantic color variables (`mieprimary`, `miedanger`, etc.) instead of hardcoded colors
- **Naming**: Semantic class names before Tailwind utilities (e.g., `className="tool-selector mie:flex mie:gap-2"`)
- **File Organization**: Keep changes localized, avoid creating new files unless necessary
- **Linting**: Run `npm run lint` before committing

### Making Changes

1. **Read the code first** - Understand existing patterns before making changes
2. **Stay in place** - Modify existing functions before adding new ones
3. **Match style** - Mirror existing naming, imports, and error handling
4. **Preserve names** - Keep function/component names unchanged unless fixing a bug
5. **Avoid new files** - Only create new modules if duplication becomes worse without them

### Testing Your Changes

```bash
# Build packages after making changes
npm run build:packages

# Test in the demo app
npm run dev:demo

# Run linter
npm run lint
```

## 🔄 Pull Request Process

### Before Opening a PR

- [ ] Code follows the core principles (KISS, DRY, YAGNI, Minimal Diff)
- [ ] Changes are tested locally
- [ ] No linting errors (`npm run lint`)
- [ ] Commit messages are clear and descriptive
- [ ] Public API changes are documented

### PR Requirements

1. **Title**: Clear, concise description of the change
2. **Description**: Explain what changed and why
3. **Link Issues**: Reference related issues with `Fixes #123` or `Relates to #123`
4. **Keep it focused**: One feature or fix per PR

### PR Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Changes Made
- Bullet list of changes

## Testing
How was this tested?

## Checklist
- [ ] Code follows project principles
- [ ] Self-review completed
- [ ] No linting errors
- [ ] Documentation updated (if needed)
```

### Review Process

1. **Automated Checks**: PRs must pass linting
2. **Code Review**: At least one maintainer approval required
3. **Feedback**: Address review comments promptly
4. **Merge Strategy**: Maintainers will squash or rebase as appropriate

## 📦 Package-Specific Guidelines

### forms-engine (Internal Package)

- Core state management and shared utilities
- Changes here affect both editor and renderer
- No direct documentation updates needed

### forms-editor

- Visual form builder component
- Public API changes require docs updates
- Test in demo app with various field types

### forms-renderer

- Form display and submission component
- Public API changes require docs updates
- Test across all rendering modes (React, Web Component, Blaze)

### Documentation Updates

When making changes to **`forms-editor`** or **`forms-renderer`**, update the documentation site (`apps/mieweb-forms-docs`) if:

- Public API changes (props, methods, exports)
- New features are added
- Breaking changes occur
- Usage examples need updating

## 🐛 Reporting Issues

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, Node version, etc.)
- Screenshots or code samples if relevant

### Feature Requests

Include:
- Use case and problem being solved
- Proposed solution (if you have one)
- Alternatives considered
- Why this fits the project scope

## ✅ Quality Standards

### Code Quality

- **Readability over cleverness** - Code should be self-explanatory
- **Early returns** instead of nested conditionals
- **Small functions** (prefer < 40 lines when possible)
- **Localize complexity** - Keep tricky logic private/internal

### Accessibility

- Semantic HTML elements
- Proper ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

### Performance

- Avoid unnecessary re-renders
- Use stable keys in lists (no index keys for dynamic lists)
- Minimize bundle size (avoid new dependencies)

## 🔐 Security

- Never commit secrets or API keys
- Validate and sanitize user inputs
- Report security vulnerabilities privately to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

- Open a discussion in GitHub Discussions
- Comment on relevant issues
- Reach out to maintainers

---

Thank you for contributing to making forms better! 🎉
