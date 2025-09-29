// Simple visibility checker utility
export function isVisible(field, allFields = []) {
  // If no enableWhen conditions, field is always visible
  if (!field.enableWhen || !Array.isArray(field.enableWhen) || field.enableWhen.length === 0) {
    return true;
  }

  // Check all enableWhen conditions
  return field.enableWhen.every(condition => {
    const sourceField = allFields.find(f => f.id === condition.fieldId);
    if (!sourceField) return false;

    const sourceValue = sourceField.answer || sourceField.selected || '';
    const targetValue = condition.answerString || '';

    switch (condition.operator) {
      case 'equals':
        return sourceValue === targetValue;
      case 'contains':
        return String(sourceValue).includes(targetValue);
      case 'includes':
        return Array.isArray(sourceValue) ? sourceValue.includes(targetValue) : false;
      default:
        return false;
    }
  });
}