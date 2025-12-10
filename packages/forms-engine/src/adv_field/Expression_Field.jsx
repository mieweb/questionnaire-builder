import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import { useFormStore } from "../state/formStore";

// Helper: Substitute field references with values
const substituteFields = (expression, data) => 
  expression.replace(/{(\w+)}/g, (_, fieldId) => data[fieldId] ?? 0);

// Helper: Validate expression syntax
const validateExpression = (expr) => {
  // Disallow single = (not part of ==, >=, <=, etc.)
  if (/(?<![=!<>])=(?!=)/.test(expr)) {
    throw new Error("Single = is not allowed. Use == for comparison.");
  }
  // Disallow spaces and restrict allowed characters
  if (!/^[0-9+\-*/().=!><]+$/.test(expr)) {
    throw new Error("Expression contains invalid characters. Only digits, operators (+-*/), parentheses, and comparison operators are allowed. No spaces.");
  }
  // Disallow exponential operator **
  if (/\*\*/.test(expr)) {
    throw new Error("Exponential operator (**) is not allowed.");
  }
  // Length limit
  if (expr.length > 200) {
    throw new Error("Expression is too long (max 200 characters).");
  }
  // Parentheses nesting limit
  let maxDepth = 0, depth = 0;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === '(') {
      depth++;
      if (depth > maxDepth) maxDepth = depth;
    } else if (expr[i] === ')') {
      depth--;
    }
  }
  if (maxDepth > 10) {
    throw new Error("Expression has too many nested parentheses (max 10).");
  }
};

// Helper: Format result based on display type
const formatResult = (value, format, decimals = 2) => {
  if (value === undefined || value === null) return "";
  if (format === "boolean") return value ? "true" : "false";
  if (format === "currency") return `$${parseFloat(value).toFixed(decimals)}`;
  if (format === "percentage") return `${parseFloat(value).toFixed(decimals)}%`;
  return parseFloat(value).toFixed(decimals);
};

// Helper: Build data object from form fields
const buildFieldData = (order, byId, excludeId) => {
  const data = {};
  order.forEach((id) => {
    const fld = byId[id];
    if (!fld || fld.id === excludeId) return;
    
    if (fld.answer != null && fld.answer !== "") {
      const numValue = Number(fld.answer);
      data[fld.id] = Number.isNaN(numValue) ? fld.answer : numValue;
    }
    
    if (fld.fieldType === "section" && fld.fields) {
      fld.fields.forEach((child) => {
        if (child.id !== excludeId && child.answer != null && child.answer !== "") {
          const childNumValue = Number(child.answer);
          data[child.id] = Number.isNaN(childNumValue) ? child.answer : childNumValue;
        }
      });
    }
  });
  return data;
};

const ExpressionField = React.memo(function ExpressionField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);
  const [evaluationError, setEvaluationError] = React.useState("");
  const [sampleDataFields, setSampleDataFields] = React.useState(field.sampleDataFields || []);
  const order = useFormStore((s) => s.order);
  const byId = useFormStore((s) => s.byId);
  
  // Evaluate expression
  const evaluateExpression = React.useCallback((expression, data = {}) => {
    if (!expression) return "";
    try {
      setEvaluationError("");
      const evaluatedExpr = substituteFields(expression, data);
      validateExpression(evaluatedExpr);
      return Function('"use strict"; return (' + evaluatedExpr + ')')();
    } catch (error) {
      setEvaluationError(error.message || "Invalid expression");
      return "";
    }
  }, []);

  // Sample preview for editor mode
  const samplePreview = React.useMemo(() => {
    if (!field.expression || !sampleDataFields?.length) return { result: "", error: "" };
    
    try {
      const sampleData = {};
      sampleDataFields.forEach((f) => {
        if (f.fieldId && f.value !== undefined) {
          sampleData[f.fieldId] = isNaN(f.value) ? f.value : parseFloat(f.value);
        }
      });
      
      const evaluatedExpr = substituteFields(field.expression, sampleData);
      validateExpression(evaluatedExpr);
      const result = Function('"use strict"; return (' + evaluatedExpr + ')')();
      
      return { 
        result: formatResult(result, field.displayFormat, field.decimalPlaces), 
        error: "" 
      };
    } catch (error) {
      return { result: "", error: error.message || "Invalid expression" };
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

  // Computed result for preview mode
  const computedResult = React.useMemo(() => {
    if (!ctrl.isPreview || !field.expression) return "";
    const actualData = buildFieldData(order, byId, field.id);
    return evaluateExpression(field.expression, actualData);
  }, [ctrl.isPreview, field.expression, order, byId, field.id, evaluateExpression]);

  // Store the computed numeric result in field.answer
  React.useEffect(() => {
    if (computedResult !== undefined && computedResult !== null && computedResult !== field.answer) {
      // Use a microtask to defer the update
      Promise.resolve().then(() => {
        ctrl.api.field.update("answer", computedResult);
      });
    }
  }, [computedResult, field.answer, ctrl.api.field]);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f }) => {
        if (isPreview) {
          return (
            <div className="space-y-2 pb-4">
              {f.label && <div className="font-light text-sm text-gray-600">{f.label}</div>}
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Expression:</span> {f.expression || "No expression defined"}
                </p>
                {computedResult != null && (
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    <span className="text-sm text-gray-600">Result: </span>
                    {formatResult(computedResult, f.displayFormat, f.decimalPlaces)}
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
              {samplePreview.error ? (
                <p className="text-xs text-red-600 mt-1">Error: {samplePreview.error}</p>
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
                <option value="percentage">Percent (%)</option>
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
                  onChange={(e) => api.field.update("decimalPlaces", parseInt(e.target.value, 10))}
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
                  aria-label="Add sample data field"
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
                        aria-label={`Remove sample field "${field.fieldName || `#${idx + 1}`}"`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Result */}
            {sampleDataFields?.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview Result:</p>
                {samplePreview.error ? (
                  <p className="text-sm text-red-600">Error: {samplePreview.error}</p>
                ) : (
                  <p className="text-lg font-semibold text-blue-600">
                    {samplePreview.result || "No result"}
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
