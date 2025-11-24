export function generateFieldId(fieldType = '', existingIds = new Set(), parentId = '') {
  // Create base ID using fieldType, optionally prefixed with parent
  const baseId = parentId ? `${parentId}-${fieldType}` : fieldType || 'field';
  
  // Check if base ID is available
  if (!existingIds.has(baseId)) return baseId;
  
  // Find highest number used for this baseId pattern
  const pattern = new RegExp(`^${baseId.replace(/[\\.*+?^${}()|[\\\]]/g, '\\$&')}-\\d+$`);
  let maxNumber = 0;
  existingIds.forEach(id => {
    if (pattern.test(id)) {
      const num = parseInt(id.split('-').pop());
      if (num > maxNumber) maxNumber = num;
    }
  });
  
  return `${baseId}-${maxNumber + 1}`;
}

export function generateOptionId(existingIds = new Set(), fieldId = '') {
  const prefix = fieldId ? `${fieldId}-option` : 'option';
  
  // Check if base ID is available
  if (!existingIds.has(prefix)) return prefix;
  
  // Find highest number used for this prefix pattern
  const pattern = new RegExp(`^${prefix.replace(/[\\.*+?^${}()|[\\\]]/g, '\\$&')}-\\d+$`);
  let maxNumber = 0;
  existingIds.forEach(id => {
    if (pattern.test(id)) {
      const num = parseInt(id.split('-').pop());
      if (num > maxNumber) maxNumber = num;
    }
  });
  
  return `${prefix}-${maxNumber + 1}`;
}
