#!/usr/bin/env node

/**
 * Script to add "mie:" prefix to all Tailwind CSS utility classes in JSX/JS files
 * for Tailwind v4.1 compatibility
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common Tailwind utility prefixes and modifiers
const TAILWIND_PATTERNS = [
  // Layout
  'aspect-', 'container', 'columns-', 'break-', 'box-', 'block', 'inline', 'flex', 'grid', 'table',
  'hidden', 'flow-', 'clear-', 'float-', 'isolate', 'isolation-', 'object-', 'overflow-',
  'overscroll-', 'static', 'fixed', 'absolute', 'relative', 'sticky', 'visible', 'invisible',
  'collapse',
  
  // Flexbox & Grid
  'basis-', 'flex-', 'grow', 'shrink', 'order-', 'grid-', 'col-', 'row-', 'auto-', 'gap-',
  'justify-', 'content-', 'items-', 'self-', 'place-',
  
  // Spacing
  'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-', 'ps-', 'pe-',
  'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-', 'ms-', 'me-',
  'space-', '-space-', 'inset-', 'top-', 'right-', 'bottom-', 'left-', 'start-', 'end-',
  
  // Sizing
  'w-', 'min-w-', 'max-w-', 'h-', 'min-h-', 'max-h-', 'size-',
  
  // Typography
  'font-', 'text-', 'antialiased', 'subpixel-antialiased', 'italic', 'not-italic',
  'leading-', 'tracking-', 'line-clamp-', 'list-', 'break-', 'hyphens-',
  'content-', 'align-', 'whitespace-', 'truncate', 'text-ellipsis', 'text-clip',
  'indent-', 'uppercase', 'lowercase', 'capitalize', 'normal-case', 'underline',
  'overline', 'line-through', 'no-underline', 'decoration-',
  
  // Backgrounds
  'bg-', 'from-', 'via-', 'to-', 'background-',
  
  // Borders
  'border', 'border-', 'divide-', 'outline-', 'ring-',
  
  // Effects
  'shadow-', 'drop-shadow-', 'opacity-', 'mix-', 'blur-', 'brightness-', 'contrast-',
  'grayscale', 'hue-', 'invert', 'saturate-', 'sepia', 'backdrop-',
  
  // Filters
  'filter', 'blur-', 'brightness-', 'contrast-', 'drop-shadow-', 'grayscale-',
  'hue-rotate-', 'invert-', 'saturate-', 'sepia-',
  
  // Tables
  'border-collapse', 'border-separate', 'caption-',
  
  // Transitions & Animation
  'transition', 'delay-', 'duration-', 'ease-', 'animate-',
  
  // Transforms
  'scale-', 'rotate-', 'translate-', 'skew-', 'origin-',
  
  // Interactivity
  'appearance-', 'cursor-', 'caret-', 'pointer-events-', 'resize', 'scroll-',
  'select-', 'snap-', 'touch-', 'user-select-', 'will-change-',
  
  // SVG
  'fill-', 'stroke-',
  
  // Accessibility
  'sr-only', 'not-sr-only', 'forced-color-adjust-',
  
  // Rounded
  'rounded',
  
  // Z-index
  'z-',
  
  // Clip
  'clip-',
];

// Tailwind responsive and state modifiers
const MODIFIERS = [
  // Responsive
  'sm:', 'md:', 'lg:', 'xl:', '2xl:',
  // Pseudo-classes
  'hover:', 'focus:', 'active:', 'visited:', 'target:', 'first:', 'last:', 'odd:', 'even:',
  'disabled:', 'enabled:', 'checked:', 'indeterminate:', 'default:', 'required:', 'valid:',
  'invalid:', 'in-range:', 'out-of-range:', 'placeholder-shown:', 'autofill:', 'read-only:',
  // Pseudo-elements
  'before:', 'after:', 'first-letter:', 'first-line:', 'marker:', 'selection:', 'file:',
  'placeholder:', 'backdrop:',
  // Parent state
  'group-hover:', 'group-focus:', 'peer-focus:', 'peer-checked:',
  // Others
  'dark:', 'print:', 'motion-safe:', 'motion-reduce:', 'contrast-more:', 'contrast-less:',
  // Child selectors
  '*:',
];

/**
 * Add "mie:" prefix to Tailwind classes in a string
 */
function addPrefixToClasses(content) {
  // Pattern to match className or class attributes
  const classNamePattern = /(className\s*=\s*)(["'`])(((?:(?!\2).)*?))\2/gs;
  
  return content.replace(classNamePattern, (match, prefix, quote, classes) => {
    // Handle template literals with ${...} expressions
    if (classes.includes('${')) {
      return `${prefix}${quote}${processTemplateLiteral(classes)}${quote}`;
    }
    
    // Split classes and process each one
    const processedClasses = classes.split(/\s+/).map(cls => processClass(cls)).join(' ');
    return `${prefix}${quote}${processedClasses}${quote}`;
  });
}

/**
 * Process template literals that contain ${...} expressions
 */
function processTemplateLiteral(template) {
  // Split by ${...} but keep the expressions
  const parts = [];
  let current = '';
  let depth = 0;
  let inExpression = false;
  
  for (let i = 0; i < template.length; i++) {
    const char = template[i];
    const next = template[i + 1];
    
    if (char === '$' && next === '{' && !inExpression) {
      // Process accumulated static text
      if (current) {
        parts.push({ type: 'static', value: current });
        current = '';
      }
      inExpression = true;
      depth = 1;
      current = '${';
      i++; // Skip the '{'
    } else if (inExpression) {
      current += char;
      if (char === '{') depth++;
      if (char === '}') {
        depth--;
        if (depth === 0) {
          parts.push({ type: 'expression', value: current });
          current = '';
          inExpression = false;
        }
      }
    } else {
      current += char;
    }
  }
  
  // Process any remaining static text
  if (current) {
    parts.push({ type: 'static', value: current });
  }
  
  // Process each part
  return parts.map(part => {
    if (part.type === 'static') {
      // Process static classes
      return part.value.split(/\s+/).map(cls => processClass(cls)).join(' ');
    }
    return part.value; // Keep expressions as-is
  }).join('');
}

/**
 * Process a single class name
 */
function processClass(cls) {
  if (!cls.trim()) {
    return cls;
  }
  
  // Check if already prefixed
  if (cls.startsWith('mie:')) {
    return cls;
  }
  
  // Check for modifiers (e.g., "hover:flex" -> "mie:hover:flex")
  // In Tailwind v4 with prefix(), modifiers come AFTER the prefix
  const modifierMatch = cls.match(/^([a-z0-9-]+):(.*)/);
  if (modifierMatch && MODIFIERS.some(m => modifierMatch[1] + ':' === m)) {
    const [, modifier, utilityClass] = modifierMatch;
    // Don't prefix if already prefixed or if it's not a Tailwind class
    if (utilityClass.startsWith('mie:')) {
      return cls;
    }
    if (isTailwindClass(utilityClass)) {
      return `mie:${modifier}:${utilityClass}`;
    }
    return cls;
  }
  
  // Check if it's a Tailwind utility class
  if (isTailwindClass(cls)) {
    return `mie:${cls}`;
  }
  
  return cls;
}

/**
 * Check if a class is a Tailwind utility class
 */
function isTailwindClass(cls) {
  // Common semantic/custom class patterns that should NOT be prefixed
  const customPatterns = [
    'editor-', 'form-', 'field-', 'section-', 'tool-', 'import-', 'export-',
    'preview-', 'renderer-', 'canvas-', 'dropdown-', 'header-', 'body-',
    'footer-', 'sidebar-', 'panel-', 'modal-', 'alert-', 'button-',
    'input-', 'label-', 'wrapper-', 'container-', 'empty-', 'custom-',
    'demo-', 'landing-', 'resource-', 'package-', 'info-',
  ];
  
  if (customPatterns.some(pattern => cls.startsWith(pattern))) {
    return false;
  }
  
  // Check exact matches for standalone utilities
  const standaloneUtils = [
    'block', 'inline', 'flex', 'grid', 'table', 'hidden', 'static', 'fixed',
    'absolute', 'relative', 'sticky', 'visible', 'invisible', 'collapse',
    'grow', 'shrink', 'italic', 'not-italic', 'antialiased', 'subpixel-antialiased',
    'truncate', 'uppercase', 'lowercase', 'capitalize', 'normal-case',
    'underline', 'overline', 'line-through', 'no-underline', 'grayscale',
    'invert', 'sepia', 'filter', 'container', 'isolate', 'resize', 'rounded',
  ];
  
  if (standaloneUtils.includes(cls)) {
    return true;
  }
  
  // Check prefix patterns
  return TAILWIND_PATTERNS.some(pattern => {
    if (pattern.endsWith('-')) {
      return cls.startsWith(pattern);
    }
    return cls === pattern || cls.startsWith(pattern + '-');
  });
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = addPrefixToClasses(content);
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`- Skipped (no changes): ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Recursively find all .jsx and .js files in a directory
 */
function findFiles(dir, pattern = /\.(jsx|js)$/) {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'build' && entry.name !== 'dist') {
        files.push(...findFiles(fullPath, pattern));
      } else if (entry.isFile() && pattern.test(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

/**
 * Main execution
 */
function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  const targetDirs = [
    path.join(rootDir, 'packages/forms-editor/src'),
    path.join(rootDir, 'packages/forms-renderer/src'),
    path.join(rootDir, 'packages/forms-engine/src'),
  ];
  
  console.log('🚀 Starting Tailwind v4.1 prefix conversion...\n');
  
  let totalFiles = 0;
  let updatedFiles = 0;
  
  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠ Directory not found: ${dir}`);
      continue;
    }
    
    console.log(`\n📂 Processing: ${dir}`);
    const files = findFiles(dir);
    
    for (const file of files) {
      totalFiles++;
      if (processFile(file)) {
        updatedFiles++;
      }
    }
  }
  
  console.log(`\n✨ Complete! Updated ${updatedFiles} of ${totalFiles} files.`);
}

main();
