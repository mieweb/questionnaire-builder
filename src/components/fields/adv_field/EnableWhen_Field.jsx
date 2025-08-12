import React from "react";
import { v4 as uuidv4 } from "uuid";

const EnableWhenField = ({
  field,
  onUpdate,
  onDelete,
  isPreview,
  fieldTypes,
  formData,
}) => {
  const handleConditionChange = (key, value) => {
    onUpdate("condition", { ...field.condition, [key]: value });
  };

  const updateChildField = (fieldKey, key, value) => {
    onUpdate(fieldKey, { ...field[fieldKey], [key]: value });
  };

  const renderChildField = (childFieldKey) => {
    const childField = field[childFieldKey];
    const FieldComponent = fieldTypes[childField.fieldType]?.component;

    if (!FieldComponent) {
      return <p className="text-red-500">Invalid field type: {childField.fieldType}</p>;
    }

    return (
      <FieldComponent
        field={childField}
        onUpdate={(key, value) => updateChildField(childFieldKey, key, value)}
        isPreview={isPreview}
      />
    );
  };

  const isConditionMet = () => {
    const conditionField = formData.find((f) => f.id === field.condition?.fieldId);
    return conditionField?.answer === field.condition?.value;
  };

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between mb-2">
        <input
          type="text"
          value={field.question}
          onChange={(e) => onUpdate("question", e.target.value)}
          placeholder="Enter question"
          className="px-3 py-2 border rounded w-full"
          disabled={isPreview}
        />
        {!isPreview && (
          <button
            onClick={onDelete}
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        )}
      </div>

      {/* Condition Selector */}
      {!isPreview && (
        <>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Condition Field:</label>
            <select
              value={field.condition?.fieldId || ""}
              onChange={(e) => handleConditionChange("fieldId", e.target.value)}
              className="px-3 py-2 border rounded w-full"
            >
              <option value="">Select a field</option>
              {formData.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.question || `Field ${f.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Condition Value:</label>
            <input
              type="text"
              value={field.condition?.value || ""}
              onChange={(e) => handleConditionChange("value", e.target.value)}
              placeholder="Enter condition value"
              className="px-3 py-2 border rounded w-full"
            />
          </div>
        </>
      )}

      {/* Render Child Fields */}
      {isPreview ? (
        isConditionMet() ? (
          <div className="mt-4">{renderChildField("field1")}</div>
        ) : (
          <div className="mt-4">{renderChildField("field2")}</div>
        )
      ) : (
        <>
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">Field 1:</label>
            {renderChildField("field1")}
          </div>
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">Field 2:</label>
            {renderChildField("field2")}
          </div>
        </>
      )}
    </div>
  );
};

export default EnableWhenField;
