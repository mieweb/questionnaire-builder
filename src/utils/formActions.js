import { v4 as uuidv4 } from "uuid";
import { initializeField } from "./initializedFieldOptions";
import fieldTypes from "../components/fields/fieldTypes-config";

export function addField(formData, setFormData, type) {
  const fieldTemplate = fieldTypes[type]?.defaultProps;
  if (!fieldTemplate) {
    alert("Unknown field type");
    return;
  }
  const initializedField = initializeField({
    ...fieldTemplate,
    id: uuidv4(),
  });
  setFormData([...formData, initializedField]);
}

export function updateField(formData, setFormData, id, key, value) {
  setFormData(
    formData.map((field) =>
      field.id === id ? { ...field, [key]: value } : field
    )
  );
}

export function deleteField(formData, setFormData, id) {
  setFormData(formData.filter((field) => field.id !== id));
}
