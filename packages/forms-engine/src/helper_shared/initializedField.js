import { generateOptionId } from "./idGenerator";
import fieldTypes from "./fieldTypes-config";

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
  
  const defaultProps = fieldTypes[fieldType]?.defaultProps || {};
  
  const hasOptionsInDefault = defaultProps.options !== undefined;
  
  return {
    id,
    ...defaultProps,
    fieldType,
    ...(field.fieldType === "section" ? { title } : { question }),
    ...rest,
    ...(hasOptionsInDefault && {
      options: initializeFieldOptions(rest.options || [], id),
    }),
  };
}


