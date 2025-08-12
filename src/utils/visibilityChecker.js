/**
 * Checks whether a given field is visible based on its "enableWhen" logic.
 * @param {Object} field - The field whose visibility we're checking.
 * @param {Array} formData - The array of all fields in the form.
 * @returns {boolean} - True if the field should be visible, false otherwise.
 */
export function checkFieldVisibility(field, formData) {
  // 1. If there's no enableWhen defined, always show the field.
  if (!field.enableWhen) return true

  const { logic = "AND", conditions = [] } = field.enableWhen
  // 2. If there are no conditions, default to visible.
  if (!conditions.length) return true

  // 3. Evaluate each condition => array of booleans.
  const results = conditions.map((cond) => evaluateCondition(cond, formData))

  // 4. Combine them with AND or OR logic.
  return logic === "AND"
    ? results.every(Boolean)
    : results.some(Boolean)
}

/**
 * Evaluates a single condition. For example:
 *   { fieldId, operator, value } = { "abcd-1234", "contains", "hello" }
 * @param {Object} condition - The condition to evaluate.
 * @param {Array} formData - All fields in the form.
 * @returns {boolean} - True if the condition passes, false if it fails.
 */
function evaluateCondition(condition, formData) {
  const { fieldId, operator, value } = condition

  // 1. Find the triggering field that this condition depends on.
  const triggerField = formData.find((f) => f.id === fieldId)
  if (!triggerField) return false // If no field found, condition fails.

  // 2. Get the current "actual" value from that trigger field,
  //    depending on fieldType.
  const actualValue = getCurrentValue(triggerField)

  // 3. Apply the operator-specific comparison.
  return applyOperator(operator, actualValue, value)
}

/**
 * Retrieves the "current value" of a field based on its fieldType.
 * This is the data we'll compare against the condition's "value".
 */
function getCurrentValue(field) {
  switch (field.fieldType) {
    case "input":
      // Text typed by the user.
      return (field.answer ?? "").toString()

    case "radio":
    case "selection":
      // Single selected option ID (string or null).
      return field.selected ?? ""

    case "check":
      // Array of selected IDs.
      return field.selected ?? []

    default:
      // Fallback (unknown type).
      return null
  }
}

/**
 * Applies the chosen operator ("equals", "contains", "includes", "regex")
 * to the actualValue from the field vs. the 'value' from the condition.
 * 
 * Note: 
 *  - For text we do case-insensitive matches ("equals", "contains", "regex").
 *  - For checkboxes ("check"), "includes" checks if the condition's 'value'
 *    is in the array of selected IDs.
 */
function applyOperator(operator, actualValue, conditionValue) {
  switch (operator) {
    case "equals":
      if (Array.isArray(actualValue)) {
        // If the field is a checkbox array, "equals" doesn't really apply 
        // unless you implement exact array matching. For now, return false:
        return false
      }
      // Case-insensitive string compare (for text or radio).
      return actualValue.toLowerCase?.() === conditionValue.toLowerCase?.()

    case "contains":
      // For text input, case-insensitive substring
      if (typeof actualValue === "string") {
        return actualValue.toLowerCase().includes((conditionValue || "").toLowerCase())
      }
      return false

    case "includes":
      // For checkboxes => actualValue is an array of selected IDs
      if (Array.isArray(actualValue)) {
        if (Array.isArray(conditionValue)) {
          // If conditionValue is also an array, decide if you want:
          // - ANY overlap => use .some(...)
          // - ALL overlap => use .every(...)
          return conditionValue.some((val) => actualValue.includes(val))
          // If you wanted "must include ALL", do:
          // return conditionValue.every((val) => actualValue.includes(val))
        } else {
          // conditionValue is a single ID => check membership
          return actualValue.includes(conditionValue)
        }
      }
      return false

    case "regex":
      // Case-insensitive regex for text input
      if (typeof actualValue === "string") {
        try {
          const re = new RegExp(conditionValue, "i")
          return re.test(actualValue)
        } catch {
          return false
        }
      }
      return false

    default:
      // Unknown operator => fail condition
      return false
  }
}