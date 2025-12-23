---
sidebar_position: 2
---

# Field Types Reference

Complete reference for all supported field types in MIE Forms. Each field type has specific properties and behaviors.

## Basic Field Types

### Text Field

Single-line text input.

```json
{
  "id": "firstName",
  "fieldType": "text",
  "question": "What is your first name?",
  "required": true,
  "answer": ""
}
```

**Use cases:** Names, email addresses, phone numbers, short text responses

---

### Long Text (Textarea)

Multi-line text input.

```json
{
  "id": "comments",
  "fieldType": "longtext",
  "question": "Additional comments",
  "answer": ""
}
```

**Note:** The fieldType is `"longtext"`, not `"textarea"`.

**Use cases:** Comments, descriptions, long-form responses

---

### Radio Buttons

Single selection from multiple options.

```json
{
  "id": "gender",
  "fieldType": "radio",
  "question": "What is your gender?",
  "required": true,
  "options": [
    { "id": "opt-1", "value": "Male" },
    { "id": "opt-2", "value": "Female" },
    { "id": "opt-3", "value": "Other" },
    { "id": "opt-4", "value": "Prefer not to say" }
  ],
  "selected": null
}
```

**Properties:**
- `options`: Array of `{ id, value }` - Available choices (each option needs unique `id` and display `value`)
- `selected`: String - ID of the selected option (or `null`)

**Use cases:** Gender selection, yes/no questions, single-choice preferences

---

### Checkboxes

Multiple selection from options.

```json
{
  "id": "interests",
  "fieldType": "check",
  "question": "Select your interests:",
  "options": [
    { "id": "opt-1", "value": "Sports" },
    { "id": "opt-2", "value": "Music" },
    { "id": "opt-3", "value": "Reading" },
    { "id": "opt-4", "value": "Travel" }
  ],
  "selected": []
}
```

**Properties:**
- `options`: Array of `{ id, value }` - Available choices
- `selected`: string[] - Array of selected option ids

**Use cases:** Multi-select preferences, symptoms, features

---

### Dropdown

Select from a dropdown list.

```json
{
  "id": "country",
  "fieldType": "dropdown",
  "question": "Select your country",
  "required": true,
  "options": [
    { "id": "opt-1", "value": "United States" },
    { "id": "opt-2", "value": "Canada" },
    { "id": "opt-3", "value": "United Kingdom" }
  ],
  "selected": null
}
```

**Properties:**
- `options`: Array of `{ id, value }` - Available choices
- `selected`: String - ID of selected option

**Use cases:** Countries, states, categories with many options

---

### Multi-Select Dropdown

Select multiple items from dropdown.

```json
{
  "id": "languages",
  "fieldType": "multiselectdropdown",
  "question": "Which languages do you speak?",
  "options": [
    { "id": "opt-1", "value": "English" },
    { "id": "opt-2", "value": "Spanish" },
    { "id": "opt-3", "value": "French" },
    { "id": "opt-4", "value": "German" }
  ],
  "selected": []
}
```

**Properties:**
- `options`: Array of `{ id, value }` - Available choices
- `selected`: string[] - Array of selected option ids

**Use cases:** Skills, languages, multi-category selection

---

### Boolean (Yes/No)

Simple yes/no toggle.

```json
{
  "id": "consent",
  "fieldType": "boolean",
  "question": "Do you agree to the terms?",
  "required": true,
  "options": [
    { "id": "yes", "value": "Yes" },
    { "id": "no", "value": "No" }
  ],
  "selected": null
}
```

**Properties:**
- `options`: Array with two items for Yes/No
- `selected`: String - ID of selected option

**Use cases:** Consent forms, binary questions, toggles

---

### Rating

Star or numeric rating scale.

```json
{
  "id": "satisfaction",
  "fieldType": "rating",
  "question": "How satisfied are you?",
  "options": [
    { "id": "opt-1", "value": "1" },
    { "id": "opt-2", "value": "2" },
    { "id": "opt-3", "value": "3" },
    { "id": "opt-4", "value": "4" },
    { "id": "opt-5", "value": "5" }
  ],
  "selected": null
}
```

**Properties:**
- `options`: Array of `{ id, value }` - Rating values (commonly 1-5 or 0-10)
- `selected`: String - ID of the selected rating

**Use cases:** Satisfaction surveys, quality ratings, NPS scores (0-10)

---

### Slider

Slider with labeled points.

```json
{
  "id": "painLevel",
  "fieldType": "slider",
  "question": "Rate your pain level",
  "options": [
    { "id": "opt-0", "value": "0" },
    { "id": "opt-1", "value": "1" },
    { "id": "opt-2", "value": "2" },
    { "id": "opt-3", "value": "3" },
    { "id": "opt-4", "value": "4" },
    { "id": "opt-5", "value": "5" },
    { "id": "opt-6", "value": "6" },
    { "id": "opt-7", "value": "7" },
    { "id": "opt-8", "value": "8" },
    { "id": "opt-9", "value": "9" },
    { "id": "opt-10", "value": "10" }
  ],
  "selected": null
}
```

**Properties:**
- `options`: Array of `{ id, value }` - Each option is a point on the slider
- `selected`: String - ID of the selected option

**Use cases:** Pain scales, preference intensity, numeric ranges

---

### Ranking

Rank items in order of preference.

```json
{
  "id": "priorities",
  "fieldType": "ranking",
  "question": "Rank these features by importance:",
  "options": [
    { "id": "opt-1", "value": "Speed" },
    { "id": "opt-2", "value": "Cost" },
    { "id": "opt-3", "value": "Quality" },
    { "id": "opt-4", "value": "Support" }
  ]
}
```

**Properties:**
- `options`: Array of `{ id, value }` - Items to rank

**Use cases:** Priority rankings, preference ordering

---

## Matrix Field Types

### Single Matrix

Radio selection grid (one choice per row).

```json
{
  "id": "feedback",
  "fieldType": "singlematrix",
  "question": "Rate each aspect:",
  "rows": [
    { "id": "quality", "value": "Quality" },
    { "id": "service", "value": "Service" },
    { "id": "value", "value": "Value" }
  ],
  "columns": [
    { "id": "poor", "value": "Poor" },
    { "id": "fair", "value": "Fair" },
    { "id": "good", "value": "Good" },
    { "id": "excellent", "value": "Excellent" }
  ],
  "selected": {}
}
```

**Properties:**
- `rows`: Array of `{ id, value }` - Row labels
- `columns`: Array of `{ id, value }` - Column options
- `selected`: Object - Selected column per row: `{ [rowId]: columnId }`

**Use cases:** Multi-attribute ratings, agreement scales

---

### Multi Matrix

Checkbox grid (multiple choices per row).

```json
{
  "id": "availability",
  "fieldType": "multimatrix",
  "question": "Select your available times:",
  "rows": [
    { "id": "mon", "value": "Monday" },
    { "id": "tue", "value": "Tuesday" },
    { "id": "wed", "value": "Wednesday" }
  ],
  "columns": [
    { "id": "am", "value": "Morning" },
    { "id": "pm", "value": "Afternoon" },
    { "id": "eve", "value": "Evening" }
  ],
  "selected": { "mon": ["am", "pm"] }
}
```

**Properties:**
- `question`: String - Question text
- `rows`: Array of `{ id, value }` - Row labels
- `columns`: Array of `{ id, value }` - Column headers
- `selected`: Object - Selected columns per row: `{ rowId: [columnId, ...], ... }`

**Use cases:** Availability grids, multi-option matrices

---

### Multi Text

Multiple labeled text inputs under one question.

```json
{
  "id": "contacts",
  "fieldType": "multitext",
  "question": "Enter contact information:",
  "options": [
    { "id": "email", "value": "Email", "answer": "" },
    { "id": "phone", "value": "Phone", "answer": "" },
    { "id": "address", "value": "Address", "answer": "" }
  ]
}
```

**Properties:**
- `question`: String - Main question  
- `options`: Array of `{ id, value, answer }` - Text input fields

**Use cases:** Contact forms, structured multi-field entry

---

## Advanced Field Types

### HTML Content

Display rich HTML content (read-only, rendered in iframe).

```json
{
  "id": "instructions",
  "fieldType": "html",
  "htmlContent": "<div style='background: #f0fdf4; padding: 20px;'><h3>Important</h3><p>Please read carefully...</p></div>",
  "iframeHeight": 200
}
```

**Properties:**
- `htmlContent`: String - HTML markup (rendered in sandboxed iframe)
- `iframeHeight`: Number - Iframe height in pixels

**Use cases:** Instructions, formatted content

---

### Image

Display an image.

```json
{
  "id": "diagram",
  "fieldType": "image",
  "imageUri": "https://example.com/image.png",
  "altText": "Diagram showing...",
  "caption": "Optional caption"
}
```

**Properties:**
- `imageUri`: String - Image URL (or base64 data URI)
- `altText`: String - Alt text for accessibility
- `caption`: String - Optional caption below the image

**Use cases:** Diagrams, reference images, visual aids

---

### Signature

Signature pad input.

```json
{
  "id": "patientSignature",
  "fieldType": "signature",
  "question": "Patient signature",
  "placeholder": "Sign here",
  "signatureData": "",
  "signatureImage": "",
  "required": true
}
```

**Properties:**
- `question`: String - Field label
- `placeholder`: String - Placeholder text for the signature pad
- `signatureData`: String - Signature stroke data (JSON)
- `signatureImage`: String - Rendered signature image (base64)
- `required`: boolean - Whether the field must be completed

**Use cases:** Consents, acknowledgements, sign-offs

---

### Expression (Calculated Field)

Auto-calculated field using JavaScript expressions.

```json
{
  "id": "bmi",
  "fieldType": "expression",
  "label": "BMI",
  "expression": "{weight} / (({height} / 100) * ({height} / 100))",
  "displayFormat": "number",
  "decimalPlaces": 1,
  "sampleDataFields": [
    { "fieldId": "weight", "value": "70" },
    { "fieldId": "height", "value": "175" }
  ],
  "answer": ""
}
```

**Properties:**
- `label`: String - Display label for the calculated result
- `expression`: String - Calculation formula (reference other fields with `{fieldId}`)
- `displayFormat`: `"number"` | `"currency"` | `"percentage"` | `"boolean"` - Display formatting
- `decimalPlaces`: Number - Decimal precision (default: 2)
- `sampleDataFields`: Array of `{ fieldId, value }` - Test data for preview in editor

**Use cases:** BMI calculators, totals, computed values, pass/fail logic

---

### Section

Group related fields under a heading.

```json
{
  "id": "section_personal",
  "fieldType": "section",
  "title": "Personal Information",
  "fields": [
    {
      "id": "name",
      "fieldType": "text",
      "question": "Name"
    }
  ]
}
```

**Properties:**
- `title`: String - Section heading
- `fields`: Array - Child fields nested under this section

**Use cases:** Form organization, visual grouping

---

### Diagram

Drawing canvas with optional background image (body charts, dental charts, etc.).

```json
{
  "id": "pain_diagram",
  "fieldType": "diagram",
  "question": "Mark areas of pain",
  "diagramImage": "https://example.com/body-chart.png",
  "placeholder": "Draw on the diagram",
  "markupData": "",
  "markupImage": "",
  "fileName": ""
}
```

**Properties:**
- `question`: String - Field label
- `diagramImage`: String - Background image (base64 or URL) - can use preset body charts
- `placeholder`: String - Placeholder text
- `markupData`: String - Drawing strokes data (JSON)
- `markupImage`: String - Rendered drawing as base64 image
- `fileName`: String - Original uploaded image filename

**Use cases:** Medical diagrams, pain charts, body maps, dental charts

---

## Common Field Properties

All field types support these core properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | **Required.** Unique field identifier |
| `fieldType` | string | **Required.** Field type (text, radio, check, etc.) |
| `question` | string | Field label/question text (most field types) |
| `required` | boolean | Whether field must be answered (default: false) |
| `enableWhen` | object | [Conditional logic](/docs/conditional-logic) rules for visibility |
| `answer` | any | Value for text-like fields (e.g. `text`, `longtext`, `expression`) |
| `selected` | string \| string[] \| object | Value for selection/matrix fields (varies by type) |

**Note:** Some field types use `label` instead of `question` (e.g., expression fields). Some advanced fields like `html` and `image` don't use `question` at all.

---

## Conditional Logic (enableWhen)

Show/hide fields based on other answers:

```json
{
  "id": "allergies_specify",
  "fieldType": "longtext",
  "question": "Please specify your allergies",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      {
        "targetId": "has_allergies",
        "operator": "equals",
        "value": "yes"
      }
    ]
  }
}
```

See [Conditional Logic Guide](/docs/conditional-logic) for details.

---

## Next Steps

- [Conditional Logic](/docs/conditional-logic) - Show/hide fields dynamically
- [Schema Format](/docs/schema-format) - Complete schema specification
