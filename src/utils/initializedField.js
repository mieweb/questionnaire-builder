import { v4 as uuidv4 } from "uuid"

export const initializeFieldOptions = (options) => {
  return options.map((option) =>
    typeof option === "string"
      ? { id: uuidv4(), value: option }
      : { ...option, id: option.id || uuidv4() }
  )
}

export const initializeField = (field) => {
  return {
    ...field,
    ...(field.fieldType !== "input" && {
      options: initializeFieldOptions(field.options || []),
    }),
  }
}


