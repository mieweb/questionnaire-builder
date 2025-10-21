import { generateOptionId } from "./idGenerator";

export const initializeFieldOptions = (options, fieldId = '') => {
  if (!Array.isArray(options)) return [];
  const existingIds = new Set();
  
  return options.map((option) => {
    if (typeof option === "string") {
      const id = generateOptionId(option, existingIds, fieldId);
      existingIds.add(id);
      return { id, value: option };
    } else {
      const id = option.id || generateOptionId(option.value, existingIds, fieldId);
      existingIds.add(id);
      return { id, ...option };
    }
  });
}

export const initializeField = (field) => {
  const { fieldType, id, question, title, ...rest } = field;
  
  const base = {
    fieldType,
    id,
    ...(field.fieldType === "section" ? { title } : { question }),
  };
  
  const textFieldTypes = ["text", "longtext"];
  
  return {
    ...base,
    ...rest,
    ...(!textFieldTypes.includes(fieldType) && {
      options: initializeFieldOptions(rest.options || [], id),
    }),
  };
}


