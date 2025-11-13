# Contributing to Questionnaire Builder

Thank you for your interest in contributing to the Questionnaire Builder project! This document provides guidelines and expectations for contributors.

## Project Overview

The Questionnaire Builder is a FHIR-compatible questionnaire system built with React, Tailwind CSS, and Zustand. For detailed information about the project's features and capabilities, see the [README.md](./README.md).

## Development Environment Setup

### Prerequisites
- Node.js (with npm)
- Git

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mieweb/questionnaire-builder.git
   cd questionnaire-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development servers:**
   ```bash
   npm run dev              # Main editor application
   npm run dev:demos        # Package demos
   ```

4. **Build packages:**
   ```bash
   npm run build            # Build all packages
   ```

### Available Scripts
- `npm run dev` - Run the main editor application
- `npm run dev:demos` - Run package demonstration applications
- `npm run build` - Build all packages
- `npm run lint` - Run ESLint on the codebase
- `npm run pack:all` - Build and pack all packages for distribution
- `npm run preview` - Preview the production build

## Project Structure

The repository is organized as a monorepo with the following top-level directories:

- **`/packages`** - Core library packages:
  - `forms-engine` - Core state management, field components, and utilities
  - `forms-editor` - Complete questionnaire editor with conditional logic
  - `forms-renderer` - Web Component + React renderer for displaying questionnaires
  
- **`/apps`** - Application examples:
  - `web-editor` - Main questionnaire editor application
  - `web-demo-packages` - Demonstration applications for the packages
  
- **`/scripts`** - Build and maintenance scripts (e.g., dependency synchronization)

- **`/.github`** - GitHub-specific files including Copilot instructions and workflows

Each package has its own `README.md` with detailed documentation:
- [forms-engine README](./packages/forms-engine/README.md)
- [forms-editor README](./packages/forms-editor/README.md)
- [forms-renderer README](./packages/forms-renderer/README.md)

## Coding Conventions

### Linting and Code Style

This project uses ESLint for code quality and consistency. The linting configuration is defined in `eslint.config.js`.

**Run the linter:**
```bash
npm run lint
```

**Key style guidelines:**
- React 18.3 with JSX runtime (no need to import React in JSX files)
- ES2020+ JavaScript features
- Follow existing patterns in the codebase

### Working with GitHub Copilot

This project includes specific instructions for GitHub Copilot to help maintain code quality and consistency. When using GitHub Copilot, please review the [copilot-instructions.md](./.github/copilot-instructions.md) for:

- Core principles: KISS, DRY, YAGNI, Minimal Diff
- Project-specific patterns and anti-patterns
- React & Tailwind best practices
- Decision checklist before making changes

Following these guidelines ensures that contributions align with the project's philosophy of simple, maintainable code.

## Branching and PR Workflow

### Branch Naming
Use descriptive branch names that indicate the purpose:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring

### Pull Request Process

1. **Create a feature branch** from the latest main branch
2. **Make your changes** following the coding conventions
3. **Test your changes** locally
4. **Run the linter** to ensure code quality
5. **Commit your changes** (see commit message guidelines below)
6. **Push your branch** and open a Pull Request
7. **Request reviews** from project maintainers
8. **Address feedback** and update your PR as needed

### PR Description Guidelines
- Clearly describe what the PR does and why
- Reference any related issues
- Include screenshots for UI changes
- List any breaking changes

## Commit Message Guidelines

Write clear, descriptive commit messages that explain the "what" and "why" of your changes:

**Format:**
```
Short summary (50 chars or less)

Optional detailed explanation of the change, including:
- Why the change was necessary
- How it addresses the issue
- Any side effects or considerations
```

**Good examples:**
- `Add dropdown field support to forms-renderer`
- `Fix conditional logic evaluation in nested sections`
- `Update README with Web Component usage examples`

**Avoid:**
- Vague messages like "fix bug" or "update code"
- Overly long single-line messages
- Unrelated changes in a single commit

## Testing Expectations

### Current State
This project does not currently have a formal test suite. When adding new features or fixing bugs:

1. **Manually test your changes** thoroughly
2. **Test in different scenarios** including edge cases
3. **Verify existing functionality** is not broken
4. **Test in the relevant applications:**
   - Run `npm run dev` to test in the editor
   - Run `npm run dev:demos` to test package integrations

### For Major Changes
- Test all field types (text, radio, checkbox, dropdown, etc.)
- Test conditional logic (`enableWhen` rules)
- Test FHIR export functionality
- Test responsive behavior on different screen sizes

## How to Request Reviews

1. **Open your Pull Request** with a clear description
2. **Assign relevant reviewers** (project maintainers will be automatically notified)
3. **Respond to feedback** promptly and professionally
4. **Mark conversations as resolved** once addressed
5. **Request re-review** after making significant changes

### What Reviewers Look For
- Code follows project conventions
- Changes are minimal and focused
- No unnecessary files or dependencies added
- Linter passes (existing issues are acceptable)
- Changes work as described
- Documentation is updated if needed

## Questions or Need Help?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Review existing issues and PRs for similar topics

---

Thank you for contributing to Questionnaire Builder! 🎉
