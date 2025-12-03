import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import { useFormStore } from "../state/formStore";

const ExpressionField = React.memo(function ExpressionField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const [evaluationError, setEvaluationError] = React.useState("");
  const [sampleDataFields, setSampleDataFields] = React.useState(field.sampleDataFields || []);
  
  // States for sample data preview (editor only)
  const [samplePreviewResult, setSamplePreviewResult] = React.useState("");
  const [samplePreviewError, setSamplePreviewError] = React.useState("");
  
  // Get all fields from the form store to access their answers in preview mode
  const order = useFormStore((s) => s.order);
  const byId = useFormStore((s) => s.byId);

  // Evaluate expression - for actual form rendering (uses real field answers)
  const evaluateExpression = React.useCallback((expression, data = {}) => {
    if (!expression) return "";
    
    try {
      setEvaluationError("");
      
      // Replace field references {fieldId} with their values
      let evaluatedExpr = expression.replace(/{(\w+)}/g, (match, fieldId) => {
        const value = data[fieldId];
        // Return the value or 0 if undefined/null for numeric operations
        return value !== undefined && value !== null ? value : 0;
      });

      // Validate expression contains only safe characters (including comparison operators)
      // Check for disallowed single = (assignment) - must be part of ==, !=, <=, or >=
      if (/(?<![=!<>])=(?!=)/.test(evaluatedExpr)) {
        throw new Error("Single = is not allowed. Use == for comparison instead.");
      }
      const allowedChars = /^[0-9+\-*/(). =!><]+$/;
      if (!allowedChars.test(evaluatedExpr)) {
        throw new Error("Expression contains invalid characters. Only numbers, operators (+, -, *, /, ==, !=, >, <, >=, <=), and parentheses are allowed.");
      }

      // Evaluate the expression
      // eslint-disable-next-line no-eval
      const result = Function('"use strict"; return (' + evaluatedExpr + ')')();
      
      // Format result based on displayFormat
      if (field.displayFormat === "boolean") {
        return result ? "true" : "false";
      } else if (field.displayFormat === "currency") {
        return `$${parseFloat(result).toFixed(2)}`;
      } else if (field.displayFormat === "percent") {
        return `${parseFloat(result).toFixed(2)}%`;
      } else if (field.displayFormat === "decimal") {
        return parseFloat(result).toFixed(field.decimalPlaces || 2);
      }
      
      return String(result);
    } catch (error) {
      setEvaluationError(error.message || "Invalid expression");
      return "";
    }
  }, [field.displayFormat, field.decimalPlaces]);

  // Update sample preview when sample data changes (for editor preview only)
  React.useEffect(() => {
    if (!field.expression) {
      setSamplePreviewResult("");
      return;
    }

    try {
      setSamplePreviewError("");
      const sampleData = {};
      
      // Build data from sample fields only
      (sampleDataFields || []).forEach((f) => {
        if (f.fieldName && f.sampleValue) {
          sampleData[f.fieldName] = isNaN(f.sampleValue) ? f.sampleValue : parseFloat(f.sampleValue);
        }
      });

      // Evaluate with sample data
      let evaluatedExpr = field.expression.replace(/{(\w+)}/g, (match, fieldId) => {
        const value = sampleData[fieldId];
        return value !== undefined && value !== null ? value : 0;
      });

      // Check for disallowed single = (assignment) - must be part of ==, !=, <=, or >=
      if (/(?<![=!<>])=(?!=)/.test(evaluatedExpr)) {
        throw new Error("Single = is not allowed. Use == for comparison instead.");
      }
      const allowedChars = /^[0-9+\-*/(). =!><]+$/;
      if (!allowedChars.test(evaluatedExpr)) {
        throw new Error("Expression contains invalid characters.");
      }

      // eslint-disable-next-line no-eval
      const result = Function('"use strict"; return (' + evaluatedExpr + ')')();

      // Format result
      if (field.displayFormat === "boolean") {
        setSamplePreviewResult(result ? "true" : "false");
      } else if (field.displayFormat === "currency") {
        setSamplePreviewResult(`$${parseFloat(result).toFixed(2)}`);
      } else if (field.displayFormat === "percent") {
        setSamplePreviewResult(`${parseFloat(result).toFixed(2)}%`);
      } else if (field.displayFormat === "decimal") {
        setSamplePreviewResult(parseFloat(result).toFixed(field.decimalPlaces || 2));
      } else {
        setSamplePreviewResult(String(result));
      }
    } catch (error) {
      setSamplePreviewError(error.message || "Invalid expression");
      setSamplePreviewResult("");
    }
  }, [sampleDataFields, field.expression, field.displayFormat, field.decimalPlaces]);

  // Sync local state when field prop changes
  React.useEffect(() => {
    setSampleDataFields(field.sampleDataFields || []);
  }, [field.sampleDataFields]);

  // Handle adding new sample data field
  const addSampleDataField = () => {
    const newFields = [...sampleDataFields, { fieldName: "", sampleValue: "" }];
    setSampleDataFields(newFields);
    ctrl.api.field.update("sampleDataFields", newFields);
  };

  // Handle updating sample data field
  const updateSampleDataField = (index, key, value) => {
    const newFields = [...sampleDataFields];
    newFields[index] = { ...newFields[index], [key]: value };
    setSampleDataFields(newFields);
    ctrl.api.field.update("sampleDataFields", newFields);
  };

  // Handle removing sample data field
  const removeSampleDataField = (index) => {
    const newFields = sampleDataFields.filter((_, i) => i !== index);
    setSampleDataFields(newFields);
    ctrl.api.field.update("sampleDataFields", newFields);
  };

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f }) => {
        if (isPreview) {
          // In preview mode, use actual form field answers
          const actualData = {};
          order.forEach((fieldId) => {
            const fld = byId[fieldId];
            if (fld && fld.id !== field.id) {
              if (fld.answer !== undefined && fld.answer !== null && fld.answer !== "") {
                actualData[fld.id] = isNaN(fld.answer) ? fld.answer : parseFloat(fld.answer);
              }
              // Also check nested fields
              if (fld.fieldType === "section" && Array.isArray(fld.fields)) {
                fld.fields.forEach((child) => {
                  if (child.id !== field.id) {
                    if (child.answer !== undefined && child.answer !== null && child.answer !== "") {
                      actualData[child.id] = isNaN(child.answer) ? child.answer : parseFloat(child.answer);
                    }
                  }
                });
              }
            }
          });

          const result = evaluateExpression(f.expression, actualData);

          return (
            <div className="space-y-2 pb-4">
              {f.label && <div className="font-light text-sm text-gray-600">{f.label}</div>}
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Expression:</span> {f.expression || "No expression defined"}
                </p>
                {result && (
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    <span className="text-sm text-gray-600">Result: </span>
                    {result}
                  </p>
                )}
                {evaluationError && (
                  <p className="text-sm text-red-600 mt-2">Error: {evaluationError}</p>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-4 w-full">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label (Optional)
              </label>
              <input
                className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                type="text"
                value={f.label || ""}
                onChange={(e) => api.field.update("label", e.target.value)}
                placeholder="Enter field label..."
              />
            </div>

            {/* Expression Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expression / Formula
              </label>
              <textarea
                className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors font-mono text-sm"
                value={f.expression || ""}
                onChange={(e) => api.field.update("expression", e.target.value)}
                placeholder="{fieldId1} + {fieldId2}"
                rows={4}
              />
              {samplePreviewError ? (
                <p className="text-xs text-red-600 mt-1">
                  Error: {samplePreviewError}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Use {'{fieldId}'} to reference other fields. Arithmetic: {'{price} * {quantity}'}. Comparison: {'{age} >= 18'} → true/false.
                </p>
              )}
            </div>

            {/* Display Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Format
              </label>
              <select
                className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none cursor-pointer transition-colors"
                value={f.displayFormat || "number"}
                onChange={(e) => api.field.update("displayFormat", e.target.value)}
              >
                <option value="number">Number</option>
                <option value="currency">Currency ($)</option>
                <option value="percent">Percent (%)</option>
                <option value="decimal">Decimal</option>
                <option value="boolean">Boolean (true/false)</option>
              </select>
            </div>

            {/* Decimal Places (for decimal format) */}
            {f.displayFormat === "decimal" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decimal Places
                </label>
                <input
                  className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                  type="number"
                  min="0"
                  max="10"
                  value={f.decimalPlaces || 2}
                  onChange={(e) => api.field.update("decimalPlaces", parseInt(e.target.value))}
                />
              </div>
            )}

            {/* Sample Data for Preview */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Sample Data (for preview testing)
                </label>
                <button
                  onClick={addSampleDataField}
                  className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  + Add Field
                </button>
              </div>

              {(sampleDataFields || []).length === 0 ? (
                <p className="text-sm text-gray-500 italic">No sample fields added yet. Add fields to preview the expression result.</p>
              ) : (
                <div className="space-y-2">
                  {sampleDataFields.map((field, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <input
                          className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors text-sm"
                          type="text"
                          value={field.fieldName || ""}
                          onChange={(e) => updateSampleDataField(idx, "fieldName", e.target.value)}
                          placeholder="Field ID (e.g., fieldId_price)"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors text-sm"
                          type="text"
                          value={field.sampleValue || ""}
                          onChange={(e) => updateSampleDataField(idx, "sampleValue", e.target.value)}
                          placeholder="Sample value (e.g., 100)"
                        />
                      </div>
                      <button
                        onClick={() => removeSampleDataField(idx)}
                        className="px-3 py-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Result */}
            {(sampleDataFields || []).length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview Result:</p>
                {samplePreviewError ? (
                  <p className="text-sm text-red-600">Error: {samplePreviewError}</p>
                ) : (
                  <p className="text-lg font-semibold text-blue-600">
                    {samplePreviewResult || "No result"}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default ExpressionField;
