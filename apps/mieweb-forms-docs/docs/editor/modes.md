---
sidebar_position: 3
---

# Editor Modes

The editor provides three distinct modes for building and testing questionnaires. Switch between them using the header tabs.

## Build Mode

Visual form builder with drag-and-drop interface.

### Features

- **Field Library** - Add fields from the tool panel on the left
- **Properties Panel** - Edit field settings on the right when a field is selected
- **Form Canvas** - Central area showing your form structure
- **Drag & Drop** - Reorder fields by dragging
- **Add/Remove** - Click field actions to duplicate or delete

### Working with Fields

1. **Add a Field** - Click any field type in the left panel
2. **Select a Field** - Click on a field in the canvas to edit its properties
3. **Edit Properties** - Use the right panel to modify:
   - Question text
   - Field options (for radio, check, dropdown, etc.)
   - Required status
   - Conditional logic (enableWhen)
4. **Reorder Fields** - Drag fields to rearrange
5. **Delete Fields** - Click the trash icon on a field

### Sections

Organize fields into logical groups:

1. Add a **Section Field** from the tool panel
2. Section fields have a `title` instead of `question`
3. Nested fields appear indented under the section
4. Sections can be nested within other sections

---

## Code Mode

Monaco-powered code editor for direct JSON/YAML editing.

### Features

- **Syntax Highlighting** - JSON with color-coded formatting
- **Auto-formatting** - Pretty-print with proper indentation
- **Validation** - Real-time error detection
- **Full Schema Access** - Edit metadata, fields, and structure directly

### When to Use Code Mode

- Bulk editing multiple fields
- Copy/paste field definitions
- Advanced schema modifications
- Viewing complete form structure
- Fine-tuning properties not exposed in Build mode

### Tips

- Changes in Code mode update Build and Preview modes instantly
- Invalid JSON prevents switching back to Build mode until fixed
- Use **Export** to download your JSON for external editing

---

## Preview Mode

Test your form as end-users will experience it.

### Features

- **Live Rendering** - See exactly how the form appears to users
- **Interactive** - Fill out the form with sample data
- **Conditional Logic Testing** - Watch fields show/hide based on answers
- **Validation Testing** - Check required fields and error states
- **Mobile Preview** - Responsive layout testing

### Testing Checklist

- ✅ All questions display correctly
- ✅ Required fields show validation on submit
- ✅ Conditional fields appear when conditions are met
- ✅ Options are clear and complete
- ✅ Layout works on different screen sizes
- ✅ Navigation flows logically

### Limitations

Preview mode is for testing only - data is not saved. Use the renderer component in your app to collect real responses.

---

## Switching Modes

### Build → Code
View the generated JSON structure of your form.

### Code → Build  
Apply your JSON changes and return to visual editing.

### Build/Code → Preview
Test your form with live interactions.

### Preview → Build/Code
Return to editing after testing.

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Switch to Build | (Click "Build" tab) |
| Switch to Code | (Click "Code" tab) |
| Switch to Preview | (Click "Preview" tab) |

---

## Next Steps

- [Importing & Schema Conversion](/docs/editor/importing) - Import existing forms
- [Export Options](/docs/editor/exporting) - Download your forms
- [Field Types](/docs/field-types) - All available field types
