---
sidebar_position: 4
---

# Theming

Both `@mieweb/forms-editor` and `@mieweb/forms-renderer` support light and dark themes with full customization via CSS variables.

## Theme Modes

Both components accept a `theme` prop:

| Value | Behavior |
|-------|----------|
| `'light'` | **(default)** Light theme |
| `'dark'` | Dark theme |

The theme is controlled by the parent application - pass the theme prop dynamically to switch themes.

### React

```jsx
import { QuestionnaireEditor } from '@mieweb/forms-editor';
import { QuestionnaireRenderer } from '@mieweb/forms-renderer';

// Light mode (default)
<QuestionnaireEditor />
<QuestionnaireRenderer formData={data} />

// Dark mode
<QuestionnaireEditor theme="dark" />
<QuestionnaireRenderer formData={data} theme="dark" />

// Dynamic theme from parent state
const [theme, setTheme] = useState('light');
<QuestionnaireEditor theme={theme} />
```

### Web Component

```html
<!-- Light mode (default) -->
<questionnaire-renderer></questionnaire-renderer>

<!-- Dark mode -->
<questionnaire-renderer theme="dark"></questionnaire-renderer>

<!-- Via JavaScript -->
<script>
  const renderer = document.querySelector('questionnaire-renderer');
  renderer.theme = 'dark';
</script>
```

### Blaze (Meteor)

```handlebars
{{> questionnaireRenderer formData=formData theme="dark"}}
```

## Custom Themes

You can fully customize the color scheme by overriding CSS variables. All components use semantic color variables that you can override in your CSS.

### Default Variables

| Variable | Default Value | Purpose |
|----------|---------------|---------|
| `--mie-color-mieprimary` | `#3b82f6` (blue-500) | Primary actions, selected states |
| `--mie-color-miesecondary` | `#6b7280` (gray-500) | Secondary elements |
| `--mie-color-mieaccent` | `#10b981` (green-500) | Success states |
| `--mie-color-miedanger` | `#ef4444` (red-500) | Errors, destructive actions |
| `--mie-color-miewarning` | `#f97316` (orange-500) | Warnings |
| `--mie-color-miesurface` | `#ffffff` | Card/panel backgrounds |
| `--mie-color-mieborder` | `#e5e7eb` (gray-200) | Borders |
| `--mie-color-mieborderinactive` | `#9ca3af` (gray-400) | Unchecked input borders |
| `--mie-color-mietext` | `#111827` (gray-900) | Primary text |
| `--mie-color-mietextsecondary` | `#f8fafc` (slate-50) | Text on primary background |
| `--mie-color-mietextmuted` | `#6b7280` (gray-500) | Muted/secondary text |
| `--mie-color-miebackground` | `#f9fafb` (gray-50) | Page background |
| `--mie-color-miebackgroundsecondary` | `#f3f4f6` (gray-100) | Section backgrounds |
| `--mie-color-miebackgroundhover` | `#eceef1` | Hover states |
| `--mie-color-mieoverlay` | `rgba(0,0,0,0.5)` | Modal backdrops |

### Dark Mode Variables

The default dark theme uses VS Code-inspired colors:

| Variable | Dark Value | Source |
|----------|------------|--------|
| `--mie-color-mieprimary` | `#6b7fa3` | Grayish-blue |
| `--mie-color-miesecondary` | `#9ca3af` | gray-400 |
| `--mie-color-mieaccent` | `#34d399` | green-400 |
| `--mie-color-miedanger` | `#f87171` | red-400 |
| `--mie-color-miewarning` | `#fb923c` | orange-400 |
| `--mie-color-miesurface` | `#252526` | VS Code sidebar |
| `--mie-color-mieborder` | `#3c3c3c` | VS Code border |
| `--mie-color-mieborderinactive` | `#5a5a5a` | Lighter border |
| `--mie-color-mietext` | `#d4d4d4` | VS Code foreground |
| `--mie-color-mietextsecondary` | `#1e1e1e` | Text on primary bg |
| `--mie-color-mietextmuted` | `#808080` | VS Code muted |
| `--mie-color-miebackground` | `#1e1e1e` | VS Code editor |
| `--mie-color-miebackgroundsecondary` | `#252526` | VS Code sidebar |
| `--mie-color-miebackgroundhover` | `#2a2d2e` | VS Code list hover |
| `--mie-color-mieoverlay` | `rgba(0,0,0,0.7)` | Darker overlay |

### Overriding Default Variables

```css
/* Override default (light) colors */
.qb-editor-root,
.qb-renderer-root {
  --mie-color-mieprimary: #8b5cf6;      /* purple */
  --mie-color-mieaccent: #14b8a6;       /* teal */
  --mie-color-miedanger: #dc2626;       /* red-600 */
}
```

### Overriding Dark Mode Variables

```css
/* Override dark mode colors */
.qb-editor-root.dark,
.qb-renderer-root.dark {
  --mie-color-mieprimary: #a78bfa;      /* lighter purple */
  --mie-color-miebackground: #18181b;   /* zinc-900 */
  --mie-color-miesurface: #27272a;      /* zinc-800 */
  --mie-color-mieborder: #3f3f46;       /* zinc-700 */
}
```

## Code Editor Theme

The built-in code editor (Monaco) in the Editor component automatically switches between `light` and `vs-dark` themes based on the current theme mode.

## Full Brand Theme Example

```css
/* Override default colors with brand theme */
.qb-editor-root,
.qb-renderer-root {
  --mie-color-mieprimary: #0066cc;             /* brand blue */
  --mie-color-miesecondary: #5c6670;           /* brand gray */
  --mie-color-mieaccent: #00a86b;              /* brand green */
  --mie-color-miedanger: #cc3300;              /* brand red */
  --mie-color-miewarning: #ff9900;             /* brand orange */
  --mie-color-miesurface: #fafafa;             /* card backgrounds */
  --mie-color-mieborder: #d0d0d0;              /* borders */
  --mie-color-mieborderinactive: #a0a0a0;      /* unchecked inputs */
  --mie-color-mietext: #1a1a1a;                /* primary text */
  --mie-color-mietextsecondary: #ffffff;       /* text on primary bg */
  --mie-color-mietextmuted: #666666;           /* muted text */
  --mie-color-miebackground: #f5f5f5;          /* page background */
  --mie-color-miebackgroundsecondary: #ebebeb; /* section backgrounds */
  --mie-color-miebackgroundhover: #e0e0e0;     /* hover states */
  --mie-color-mieoverlay: rgba(0, 0, 0, 0.5);  /* modal backdrops */
}

/* Override dark mode colors with brand theme */
.qb-editor-root.dark,
.qb-renderer-root.dark {
  --mie-color-mieprimary: #4d9fff;             /* lighter brand blue */
  --mie-color-miesecondary: #8a9199;           /* lighter brand gray */
  --mie-color-mieaccent: #33cc99;              /* lighter brand green */
  --mie-color-miedanger: #ff6644;              /* lighter brand red */
  --mie-color-miewarning: #ffbb33;             /* lighter brand orange */
  --mie-color-miesurface: #1a1a1a;             /* card backgrounds */
  --mie-color-mieborder: #333333;              /* borders */
  --mie-color-mieborderinactive: #555555;      /* unchecked inputs */
  --mie-color-mietext: #e0e0e0;                /* primary text */
  --mie-color-mietextsecondary: #0d0d0d;       /* text on primary bg */
  --mie-color-mietextmuted: #888888;           /* muted text */
  --mie-color-miebackground: #0d0d0d;          /* page background */
  --mie-color-miebackgroundsecondary: #1a1a1a; /* section backgrounds */
  --mie-color-miebackgroundhover: #262626;     /* hover states */
  --mie-color-mieoverlay: rgba(0, 0, 0, 0.7);  /* modal backdrops */
}
```
