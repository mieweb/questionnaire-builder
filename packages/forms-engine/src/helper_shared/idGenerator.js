export function generateFieldId(question = '', fieldType = '', existingIds = new Set()) {
  const baseId = fieldType || 'field';
  
  // Check if base ID is available
  if (!existingIds.has(baseId)) return baseId;
  
  // Add incrementing number for collisions
  let counter = 1;
  let candidateId = `${baseId}-${counter}`;
  while (existingIds.has(candidateId)) {
    counter++;
    candidateId = `${baseId}-${counter}`;
  }
  return candidateId;
}

export function generateOptionId(value = '', existingIds = new Set(), fieldId = '') {
  const prefix = fieldId ? `${fieldId}-option` : 'option';
  
  // Check if base ID is available
  if (!existingIds.has(prefix)) return prefix;
  
  // Add incrementing number for collisions
  let counter = 1;
  let candidateId = `${prefix}-${counter}`;
  while (existingIds.has(candidateId)) {
    counter++;
    candidateId = `${prefix}-${counter}`;
  }
  return candidateId;
}
