---
sidebar_position: 3
---

# Conditional Logic

Control field visibility dynamically based on user responses using `enableWhen` conditions. This powerful feature allows you to create adaptive forms that show only relevant questions.

## Basic Concept

Fields with `enableWhen` are hidden by default and only appear when their conditions are met.

```json
{
  "id": "follow_up",
  "fieldType": "longtext",
  "question": "Please provide more details",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      {
        "targetId": "needs_followup",
        "operator": "equals",
        "value": "needs_followup-option"
      }
    ]
  }
}
```

In this example, the `follow_up` field only appears when `needs_followup` equals the `Yes` option id (`"needs_followup-option"`).

## Structure

```json
"enableWhen": {
  "logic": "AND" | "OR",
  "conditions": [
    {
      "targetId": "field_id",
      "operator": "equals" | "contains" | "includes" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual",
      "value": "comparison_value"
    }
  ]
}
```

### Logic Types

- **`AND`**: All conditions must be true
- **`OR`**: At least one condition must be true

### Operators

For fields with options (e.g. `radio`, `dropdown`, `boolean`, `check`, `multiselectdropdown`), comparisons are done against the **selected option id** (the `id` inside the option object).

| Operator | Description | Works With |
|----------|-------------|------------|
| `equals` | Exact match | Text fields (exact string match), selection fields (option id match) |
| `contains` | Substring match (case-insensitive, word-boundary aware) | Text fields |
| `includes` | Array contains value (string compare) | `check`, `multiselectdropdown`, `ranking` |
| `greaterThan` | Numeric comparison &gt; | Expression fields with numeric display formats |
| `lessThan` | Numeric comparison &lt; | Expression fields with numeric display formats |
| `greaterThanOrEqual` | Numeric comparison &gt;= | Expression fields with numeric display formats |
| `lessThanOrEqual` | Numeric comparison &lt;= | Expression fields with numeric display formats |

**Note:** Numeric operators (`greaterThan`, `lessThan`, etc.) only work with expression fields that have numeric `displayFormat` (currency, percentage, or number).

## Examples

### Simple Yes/No Condition

Show field when user selects "Yes":

```json
{
  "id": "has_insurance",
  "fieldType": "radio",
  "question": "Do you have health insurance?",
  "options": [
    { "id": "has_insurance-option", "value": "Yes" },
    { "id": "has_insurance-option-2", "value": "No" }
  ]
},
{
  "id": "insurance_provider",
  "fieldType": "text",
  "question": "Insurance provider name",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      {
        "targetId": "has_insurance",
        "operator": "equals",
        "value": "has_insurance-option"
      }
    ]
  }
}
```

### Multiple Conditions (AND)

Show field when ALL conditions are met:

```json
{
  "id": "age_years",
  "fieldType": "expression",
  "label": "Age (years)",
  "displayFormat": "number",
  "expression": "2024 - {birth_year}"
},
{
  "id": "has_guardian",
  "fieldType": "radio",
  "question": "Do you have a legal guardian?",
  "options": [
    { "id": "has_guardian-option", "value": "Yes" },
    { "id": "has_guardian-option-2", "value": "No" }
  ]
},
{
  "id": "emergency_contact",
  "fieldType": "text",
  "question": "Emergency contact number",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      {
        "targetId": "age_years",
        "operator": "lessThan",
        "value": "18"
      },
      {
        "targetId": "has_guardian",
        "operator": "equals",
        "value": "has_guardian-option"
      }
    ]
  }
}
```

This field appears only when age &lt; 18 AND has_guardian = "Yes".

### Multiple Conditions (OR)

Show field when ANY condition is met:

```json
{
  "id": "special_accommodations",
  "fieldType": "longtext",
  "question": "Describe your accessibility needs",
  "enableWhen": {
    "logic": "OR",
    "conditions": [
      {
        "targetId": "has_disability",
        "operator": "equals",
        "value": "has_disability-option"
      },
      {
        "targetId": "age_years",
        "operator": "greaterThan",
        "value": "65"
      },
      {
        "targetId": "pregnant",
        "operator": "equals",
        "value": "pregnant-option"
      }
    ]
  }
}
```

This field appears if has_disability = "Yes" OR age &gt; 65 OR pregnant = "Yes".

### Numeric Range Conditions

Show field based on calculated values:

```json
{
  "id": "bmi_advice_overweight",
  "fieldType": "html",
  "htmlContent": "<p>Consider consulting a healthcare provider.</p>",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      {
        "targetId": "bmi",
        "operator": "greaterThanOrEqual",
        "value": "25"
      },
      {
        "targetId": "bmi",
        "operator": "lessThan",
        "value": "30"
      }
    ]
  }
}
```

Shows when BMI is between 25 and 30.

### Multi-Select Conditions

Check if a specific option is selected in a multi-select field:

```json
{
  "id": "allergies",
  "fieldType": "check",
  "question": "Which allergies apply?",
  "options": [
    { "id": "allergies-option", "value": "Food" },
    { "id": "allergies-option-2", "value": "Medication" },
    { "id": "allergies-option-3", "value": "Other" }
  ]
},
{
  "id": "allergy_details",
  "fieldType": "longtext",
  "question": "Describe your allergies",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      {
        "targetId": "allergies",
        "operator": "includes",
        "value": "allergies-option"
      }
    ]
  }
}
```

Shows when the `Food` option is selected.

### Expression Field Conditions

Use calculated field results in conditions:

```json
{
  "id": "birth_year",
  "fieldType": "text",
  "question": "Year of birth"
},
{
  "id": "calculated_age",
  "fieldType": "expression",
  "label": "Your age",
  "displayFormat": "number",
  "expression": "2024 - {birth_year}"
},
{
  "id": "adult_consent",
  "fieldType": "boolean",
  "question": "I consent to adult terms",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      {
        "targetId": "calculated_age",
        "operator": "greaterThanOrEqual",
        "value": "18"
      }
    ]
  }
}
```

Note: numeric comparisons (`greaterThan`, `lessThan`, etc.) only run against **expression** fields with a numeric `displayFormat`.

### Complex Nested Logic

For complex scenarios, combine multiple conditions:

```json
{
  "id": "prescription_info",
  "fieldType": "longtext",
  "question": "List your current prescriptions",
  "enableWhen": {
    "logic": "OR",
    "conditions": [
      {
        "targetId": "age_years",
        "operator": "greaterThan",
        "value": "50"
      },
      {
        "targetId": "has_chronic_condition",
        "operator": "equals",
        "value": "has_chronic_condition-option"
      }
    ]
  }
},
{
  "id": "medication_allergies",
  "fieldType": "longtext",
  "question": "List any medication allergies",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      {
        "targetId": "has_medication_allergies",
        "operator": "equals",
        "value": "has_medication_allergies-option"
      }
    ]
  }
}
```

## Best Practices

### 1. Keep Logic Simple

Prefer straightforward conditions. Complex nested logic can confuse users.

```json
// ✅ Good - Clear and simple
"enableWhen": {
  "logic": "AND",
  "conditions": [
    { "targetId": "pregnant", "operator": "equals", "value": "yes" }
  ]
}

// ❌ Avoid - Overly complex
"enableWhen": {
  "logic": "OR",
  "conditions": [
    { "targetId": "a", "operator": "equals", "value": "1" },
    { "targetId": "b", "operator": "greaterThan", "value": "5" },
    { "targetId": "c", "operator": "contains", "value": "x" },
    { "targetId": "d", "operator": "lessThan", "value": "10" }
  ]
}
```

### 2. Avoid Circular Dependencies

Don't create conditions that reference each other:

```json
// ❌ Circular dependency
{
  "id": "field_a",
  "enableWhen": {
    "conditions": [{ "targetId": "field_b", "operator": "equals", "value": "yes" }]
  }
},
{
  "id": "field_b",
  "enableWhen": {
    "conditions": [{ "targetId": "field_a", "operator": "equals", "value": "yes" }]
  }
}
```

### 3. Test All Paths

Ensure all conditional paths work as expected in preview mode.

### 4. Provide Context

If you want to explain why something appeared, place an `html` field near it with explanatory text.

### 5. Use Appropriate Operators

Choose operators that match your data type:

- **String values**: Use `equals` (exact) or `contains` (case-insensitive word match)
- **Numbers**: Use comparison operators (`greaterThan`, `lessThan`, etc.) on numeric **expression** fields
- **Multi-select**: Use `includes`

Negative operators like `notEquals` / `notContains` are not currently supported.

## Common Patterns

### Age-Based Questions

```json
{
  "id": "pediatric_questions",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      { "targetId": "age_years", "operator": "lessThan", "value": "18" }
    ]
  }
}
```

### Follow-Up Questions

```json
{
  "id": "symptoms",
  "fieldType": "check",
  "options": [...]
},
{
  "id": "symptom_duration",
  "question": "How long have you had these symptoms?",
  "enableWhen": {
    "logic": "AND",
    "conditions": [
      { "targetId": "symptoms", "operator": "includes", "value": "symptoms-option" }
    ]
  }
}
```

### Conditional Disclaimers

```json
{
  "id": "risk_warning",
  "fieldType": "html",
  "htmlContent": "<div class='warning'>High risk detected...</div>",
  "enableWhen": {
    "logic": "OR",
    "conditions": [
      { "targetId": "risk_score", "operator": "greaterThan", "value": "7" }
    ]
  }
}
```

## Debugging Tips

1. **Use Preview Mode**: Test conditions in the editor's preview mode
2. **Check Field IDs**: Ensure `targetId` matches exactly (case-sensitive)
3. **Verify Values**: `equals` matches exactly (selection fields compare option ids). `contains` is case-insensitive.
4. **Start Simple**: Build complex logic incrementally

## Next Steps

- [Field Types](/docs/field-types) - Learn about all field types
- [Expression Fields](/docs/field-types#expression-calculated-field) - Calculated fields for conditions
- [Schema Format](/docs/schema-format) - Complete schema format
