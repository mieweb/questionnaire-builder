import { v4 as uuidv4 } from "uuid";
import { initializeField } from "./initializedField";
import fieldTypes from "../fields/fieldTypes-config";

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

export function updateChildField(formData, setFormData, sectionId, childId, key, value) {
  setFormData(
    formData.map((f) =>
      f.id !== sectionId
        ? f
        : {
            ...f,
            fields: (f.fields || []).map((c) =>
              c.id === childId ? { ...c, [key]: value } : c
            ),
          }
    )
  );
}

export function deleteChildField(formData, setFormData, sectionId, childId) {
  setFormData(
    formData.map((f) =>
      f.id !== sectionId
        ? f
        : { ...f, fields: (f.fields || []).filter((c) => c.id !== childId) }
    )
  );
}
