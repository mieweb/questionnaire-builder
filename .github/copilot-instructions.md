# Copilot Instructions for Questionnaire Builder

## Core Development Principles

### 🎯 DRY (Don't Repeat Yourself)
- Extract duplicate code into reusable functions immediately
- Create shared utilities for common patterns
- Maintain single source of truth for each piece of logic
- Refactor aggressively when duplication is detected

### 💋 KISS (Keep It Simple, Stupid)  
- Choose the simplest solution that solves the problem
- Avoid premature optimization and over-engineering
- Write self-documenting code with clear naming
- Break complex functions into smaller, focused units
- Prioritize readability over cleverness

### 🧹 Code Organization
- **Clear folder purpose**: Every directory should have an obvious organizing principle
- **No orphaned files**: All files should have clear context and relationships
- **Immediate clarity**: Folder structure should be self-explanatory
- **Document relationships**: Add README files when organization isn't obvious

## Technical Standards

### TypeScript/JavaScript
- Use TypeScript strict mode with proper type definitions
- Prefer `const` over `let`, avoid `var` entirely
- Use meaningful variable and function names
- Implement proper error handling with try-catch blocks
- Follow consistent code formatting (use Prettier configuration)

### React/Frontend
- Use functional components with hooks over class components
- Implement proper prop validation with TypeScript interfaces  
- Follow React best practices (avoid direct DOM manipulation)
- Use semantic HTML elements for better accessibility
- Implement proper loading and error states

### State Management
- Keep component state minimal and focused
- Lift state up when multiple components need access
- Use proper state initialization and cleanup
- Implement optimistic updates where appropriate

## Accessibility Requirements

### 🎯 Interactive Elements
- **Required ARIA labels**: All buttons, links, forms, and dialogs must have descriptive labels
- **Semantic HTML first**: Use proper HTML elements before adding ARIA roles
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
- **Focus management**: Provide visible focus indicators and logical tab order

### 📢 Dynamic Content
- **Live regions**: Use `aria-live` for dynamic content updates
- **Screen reader announcements**: Ensure important changes are announced
- **Loading states**: Provide accessible loading and error messages
- **Modal focus**: Trap focus within modals and return focus appropriately

## Internationalization (I18N)

### 🌍 Text Externalization
- **No hardcoded strings**: All user-facing text must use translation keys
- **RTL support**: Test layouts for Arabic, Hebrew, and other RTL languages
- **Language switching**: Implement dynamic language selection
- **Placeholder handling**: Externalize placeholder text and error messages

### 🕐 Localization
- **Format functions**: Use proper date, time, number, and currency formatting
- **Text expansion**: Design UI to handle text length variations (30-200% expansion)
- **Cultural considerations**: Respect cultural differences in color, imagery, and interaction patterns

## Documentation Standards

### Visual Documentation
- **Mermaid diagrams required**: Replace all ASCII art with proper Mermaid diagrams
- **Meaningful names**: Use descriptive names (`UserAuth`, `DataProcessor`) not single letters
- **Appropriate diagram types**:
  - `flowchart TD` for process flows
  - `graph LR` for system architecture  
  - `sequenceDiagram` for API interactions
  - `gitgraph` for branching strategies
- **Visual hierarchy**: Use `classDef` styling and emojis sparingly

### Code Documentation
- **JSDoc comments**: Document all public functions and complex logic
- **README files**: Maintain up-to-date setup and usage instructions
- **Cross-references**: Link related documentation instead of duplicating content
- **Architecture updates**: Update main docs when system structure changes

## Development Workflow

### 🔄 Refactoring
- **Continuous improvement**: Refactor during feature development, not separately
- **Test coverage**: Ensure tests pass before and after refactoring
- **Incremental changes**: Make small, reviewable changes
- **Behavior preservation**: External behavior should remain unchanged

### ⚰️ Dead Code Management
- **Immediate removal**: Delete unused code when identified
- **Archive significant code**: Move important dead code to `.attic/` with documentation
- **Context preservation**: Explain why code was archived
- **Regular cleanup**: Review attic directory monthly

### GitHub Actions & CI/CD
- **Script-first approach**: Workflows should call locally-runnable scripts
- **Local parity**: Developers must be able to reproduce CI commands locally
- **Thin wrappers**: Keep GitHub Actions simple, put logic in scripts
- **Debug-friendly**: Failed CI should be reproducible in local environment

## Quality Checklist

### Before Every Commit
- [ ] **Tests pass**: Run full test suite locally
- [ ] **No duplication**: Check for repeated code patterns
- [ ] **Accessibility**: Verify ARIA labels and keyboard navigation
- [ ] **I18N compliance**: Confirm text externalization
- [ ] **Dead code**: Remove unused imports and functions
- [ ] **Documentation**: Update relevant docs for changes
- [ ] **Type safety**: Ensure TypeScript compilation without errors

### Code Review Focus
- [ ] **DRY violations**: Look for opportunities to extract common code
- [ ] **Simplicity**: Can the solution be made clearer or simpler?
- [ ] **Accessibility**: Are all interactive elements properly labeled?
- [ ] **Performance**: Any obvious performance issues?
- [ ] **Security**: Check for potential security vulnerabilities
- [ ] **Mobile compatibility**: Verify responsive design works properly

## Error Handling Patterns

### Frontend Error Handling
- Implement proper error boundaries in React
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Implement retry mechanisms for network requests
- Show loading states during async operations

### API Integration
- Handle network timeouts and failures gracefully
- Implement proper HTTP status code handling
- Use consistent error response formats
- Provide fallback behavior when APIs are unavailable

## Performance Guidelines

- Implement code splitting for large bundles
- Use React.memo and useMemo appropriately (but don't over-optimize)
- Optimize images and assets
- Implement proper caching strategies
- Monitor bundle size and loading performance