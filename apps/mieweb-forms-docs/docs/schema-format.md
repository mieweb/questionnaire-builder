---
sidebar_position: 3
---

# Schema Format

Complete reference for MIE Forms schema structure. The schema defines the questionnaire structure, metadata, and field definitions.

## Root Schema Properties

```json
{
  "schemaType": "mieforms-v1.0",
  "title": "Patient Intake Form",
  "description": "Complete patient information form",
  "showProgressBar": "off",
  "progressBarType": "questions",
  "showQuestionNumbers": "onPage",
  "completedHtml": "<h3>Thank you!</h3><p>Your response has been submitted.</p>",
  "fields": [...]
}
```

MIE Forms requires `schemaType` and `fields`. Any additional root-level properties are treated as metadata and preserved when you edit/export the schema.

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `schemaType` | string | Schema version identifier (use `"mieforms-v1.0"`) |
| `fields` | array | Array of field definitions (see [Field Types](/docs/field-types)) |

### Optional Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | string | Form title displayed at the top |
| `description` | string | Form description or instructions |
| `showProgressBar` | string | SurveyJS metadata preserved on import (not currently used by renderer) |
| `progressBarType` | string | SurveyJS metadata preserved on import (not currently used by renderer) |
| `showQuestionNumbers` | string | SurveyJS metadata preserved on import (not currently used by renderer) |
| `completedHtml` | string | SurveyJS metadata preserved on import (not currently used by renderer) |

---

## Field Structure

All fields share common properties and have type-specific properties.

### Common Field Properties

```json
{
  "id": "patient_name",
  "fieldType": "text",
  "question": "What is your name?",
  "required": true,
  "enableWhen": {...},
  "answer": ""
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique field identifier |
| `fieldType` | string | ✅ | Field type (text, radio, check, etc.) |
| `question` | string | Most types | Field label/question text |
| `required` | boolean | ❌ | Whether field must be answered |
| `enableWhen` | object | ❌ | Conditional visibility rules |
| `answer` | any | ❌ | User-entered answer value (used when building a `QuestionnaireResponse`) |
| `selected` | string \| string[] \| object | ❌ | User-selected answer value for choice/matrix fields (varies by type; used when building a `QuestionnaireResponse`) |

See [Field Types](/docs/field-types) for complete list of field types and their properties.

---

## Sections

Group related fields under sections:

```json
{
  "id": "section_personal",
  "fieldType": "section",
  "title": "Personal Information",
  "fields": [
    {
      "id": "name",
      "fieldType": "text",
      "question": "Full Name"
    },
    {
      "id": "dob",
      "fieldType": "text",
      "question": "Date of Birth"
    }
  ]
}
```

Sections support nesting - you can have sections within sections.

---

## Conditional Logic

Use `enableWhen` to show/hide fields based on other answers:

```json
{
  "id": "allergies_details",
  "fieldType": "longtext",
  "question": "Please list your allergies",
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

**Operators:**
- `equals` - Exact match
- `contains` - Contains substring
- `includes` - Array contains value (for multi-select fields)
- `greaterThan` / `lessThan` - Numeric comparison (expression fields with numeric display formats)
- `greaterThanOrEqual` / `lessThanOrEqual` - Numeric comparison with equals (expression fields with numeric display formats)

See [Conditional Logic](/docs/conditional-logic) for detailed guide.

---

## Complete Example

This example defines a two-section patient survey. It demonstrates:

- **Root metadata**: `title`, `description`, and progress bar settings. These describe the questionnaire but don’t store answers.
- **Sections**: `section_demographics` and `section_medical` group fields under `fields: [...]`.
- **User answers**:
  - Text fields store user input in `answer` (e.g. `name.answer`, `age.answer`).
  - Choice fields store user selection in `selected` (e.g. `gender.selected`, `has_conditions.selected`, `conditions_list.selected`).
- **Conditional logic (`enableWhen`)**: `conditions_list` is conditionally shown based on the current answer of `has_conditions`.

### How the `enableWhen` in this example works

Inside the `conditions_list` field, you’ll see:

```json
"enableWhen": {
  "logic": "AND",
  "conditions": [
    {
      "targetId": "has_conditions",
      "operator": "equals",
      "value": "yes"
    }
  ]
}
```

This means:

- `targetId: "has_conditions"` points to the controlling field (the boolean question: “Do you have any chronic conditions?”).
- `operator: "equals"` means “the target’s current answer must match exactly”.
- `value: "yes"` is the value that must be selected in the target field.
- `logic: "AND"` means **all** entries in `conditions: [...]` must be true for this field to be visible.
  - In this example there is only one condition, so `AND` doesn’t change behavior—but it matters when you add multiple conditions.

### What a user experiences

- If the user selects **Yes** for `has_conditions` (i.e. `has_conditions.selected` becomes `"yes"`), then the condition is true and `conditions_list` becomes visible.
- If the user selects **No** (or leaves it unset), the condition is false and `conditions_list` stays hidden.

### Why `selected` is used here

Both `has_conditions` (boolean-style) and `conditions_list` (multi-select checkboxes) store user choices in `selected`:

- `has_conditions.selected` is a single value (e.g. `"yes"` or `"no"`).
- `conditions_list.selected` is an array (e.g. `["diabetes", "asthma"]`) because users can pick multiple options.

When rendered, users fill in `answer`/`selected`, and those values are what gets converted into a FHIR `QuestionnaireResponse`.

```json
{
  "schemaType": "mieforms-v1.0",
  "title": "Patient Health Survey",
  "description": "Please complete this health assessment",
  "showProgressBar": "top",
  "progressBarType": "questions",
  "fields": [
    {
      "id": "section_demographics",
      "fieldType": "section",
      "title": "Demographics",
      "fields": [
        {
          "id": "name",
          "fieldType": "text",
          "question": "Full Name",
          "required": true,
          "answer": ""
        },
        {
          "id": "age",
          "fieldType": "text",
          "question": "Age",
          "required": true,
          "answer": ""
        },
        {
          "id": "gender",
          "fieldType": "radio",
          "question": "Gender",
          "options": [
            { "id": "male", "value": "Male" },
            { "id": "female", "value": "Female" },
            { "id": "other", "value": "Other" }
          ],
          "selected": null
        }
      ]
    },
    {
      "id": "section_medical",
      "fieldType": "section",
      "title": "Medical History",
      "fields": [
        {
          "id": "has_conditions",
          "fieldType": "boolean",
          "question": "Do you have any chronic conditions?",
          "options": [
            { "id": "yes", "value": "Yes" },
            { "id": "no", "value": "No" }
          ],
          "selected": null
        },
        {
          "id": "conditions_list",
          "fieldType": "check",
          "question": "Select all that apply",
          "options": [
            { "id": "diabetes", "value": "Diabetes" },
            { "id": "hypertension", "value": "Hypertension" },
            { "id": "asthma", "value": "Asthma" }
          ],
          "selected": [],
          "enableWhen": {
            "logic": "AND",
            "conditions": [
              {
                "targetId": "has_conditions",
                "operator": "equals",
                "value": "yes"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## SurveyJS Compatibility

MIE Forms supports importing SurveyJS schemas. The renderer auto-detects and converts SurveyJS format:

```json
{
  "pages": [{
    "elements": [
      {
        "type": "text",
        "name": "name",
        "title": "Your Name",
        "isRequired": true
      }
    ]
  }]
}
```

---

## Next Steps

- [Field Types](/docs/field-types) - All supported field types and properties
- [Conditional Logic](/docs/conditional-logic) - Advanced enableWhen rules
- [Renderer Quickstart](/docs/getting-started/quickstart-renderer) - Display forms
- [Editor Quickstart](/docs/getting-started/quickstart-editor) - Build forms visually
