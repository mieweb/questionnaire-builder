import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import { useFormStore } from "../state/formStore";
import { NUMERIC_EXPRESSION_FORMATS } from "../helper_shared/fieldTypes-config";

// Helper: Substitute field references with values
const substituteFields = (expression, data) => 
  expression.replace(/{(\w+)}/g, (_, fieldId) => data[fieldId] ?? 0);

// Helper: Validate expression syntax
const validateExpression = (expr) => {
  // Only allow: numbers, operators, parentheses, spaces, and {fieldId} references
  if (!/^[\d+\-*/(). =!<>]*(\{[a-zA-Z_][a-zA-Z0-9_]*\}[\d+\-*/(). =!<>]*)*$/.test(expr)) {
    throw new Error("Expression contains invalid characters. Use {fieldId} for field references.");
  }
  // Disallow single = (must be ==, <=, >=, or !=)
  if (/[^=!<>]=[^=]|^=[^=]|[^=]=$/.test(expr)) {
    throw new Error("Single = is not allowed. Use == for comparison.");
  }
};

// Helper: Format result based on display type
const formatResult = (value, format, decimals = 2) => {
  if (value === undefined || value === null) return "";
  if (format === "boolean") return value ? "true" : "false";
  const num = parseFloat(value);
  if (!Number.isFinite(num)) {
    return String(value);
  }
  if (format === "currency") return `$${num.toFixed(decimals)}`;
  if (format === "percentage") return `${num.toFixed(decimals)}%`;
  return num.toFixed(decimals);
};

// Helper: Build data object from form fields
const buildFieldData = (order, byId, excludeId) => {
  const data = {};
  order.forEach((id) => {
    const fld = byId[id];
    if (!fld || fld.id === excludeId) return;
    
    if (fld.answer != null && fld.answer !== "") {
      const parsed = parseFloat(fld.answer);
      data[fld.id] = !Number.isNaN(parsed) ? parsed : fld.answer;
    }
    
    if (fld.fieldType === "section" && fld.fields) {
      fld.fields.forEach((child) => {
        if (child.id !== excludeId && child.answer != null && child.answer !== "") {
          const parsed = parseFloat(child.answer);
          data[child.id] = !Number.isNaN(parsed) ? parsed : child.answer;
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
  
  // Evaluate expression (pure function - no state updates)
  const evaluateExpression = React.useCallback((expression, data = {}) => {
    if (!expression) return { result: "", error: "" };
    try {
      const evaluatedExpr = substituteFields(expression, data);
      validateExpression(evaluatedExpr);
      const result = Function('"use strict"; return (' + evaluatedExpr + ')')();
      return { result, error: "" };
    } catch (error) {
      return { result: "", error: error.message || "Invalid expression" };
    }
  }, []);

  // Sample preview for editor mode
  const samplePreview = React.useMemo(() => {
    if (!field.expression || !sampleDataFields?.length) return { result: "", error: "" };
    
    try {
      const sampleData = {};
      sampleDataFields.forEach((f) => {
        if (f.fieldId && f.value) {
          const parsed = parseFloat(f.value);
          sampleData[f.fieldId] = !Number.isNaN(parsed) ? parsed : f.value;
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

  // Sync local state when field prop changes, adding unique IDs if missing
  React.useEffect(() => {
    const fieldsWithIds = (field.sampleDataFields || []).map((f, idx) => {
      if (f._id) return f;
      // Create unique ID: combine timestamp with index and random component
      const uniqueId = `${Date.now()}-${idx}-${Math.random()}`;
      return { ...f, _id: uniqueId };
    });
    setSampleDataFields(fieldsWithIds);
  }, [field.sampleDataFields]);

  // Handle adding new sample data field
  const addSampleDataField = () => {
    const newFields = [...sampleDataFields, { _id: `${Date.now()}-${Math.random()}`, fieldId: "", value: "" }];
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
  const evaluationResult = React.useMemo(() => {
    if (!ctrl.isPreview || !field.expression) return { result: "", error: "" };
    const actualData = buildFieldData(order, byId, field.id);
    return evaluateExpression(field.expression, actualData);
  }, [ctrl.isPreview, field.expression, order, byId, field.id]);

  // Store the computed numeric result in field.answer and any evaluation error in state
  React.useEffect(() => {
    const { result: computedResult, error } = evaluationResult;
    setEvaluationError(error);

    // Avoid persisting non-finite numbers (NaN/Infinity) into schema/exports (YAML prints `.nan`).
    const normalizedComputedResult =
      typeof computedResult === "number" && !Number.isFinite(computedResult)
        ? ""
        : computedResult;

    if (normalizedComputedResult !== undefined && normalizedComputedResult !== null && normalizedComputedResult !== "") {
      // Check if value has changed, using epsilon for numeric comparisons
      let hasChanged = true;
      const bothNumeric =
        typeof normalizedComputedResult === "number" && typeof field.answer === "number";
      
      if (bothNumeric) {
        // For numbers, use epsilon-based comparison to avoid floating-point precision issues
        hasChanged = Math.abs(normalizedComputedResult - field.answer) > Number.EPSILON;
      } else if (typeof normalizedComputedResult === typeof field.answer) {
        // For same types (string, boolean), use strict equality
        hasChanged = normalizedComputedResult !== field.answer;
      }
      // If types differ, hasChanged stays true (always update)
      
      if (hasChanged) {
        Promise.resolve().then(() => {
          ctrl.api.field.update("answer", normalizedComputedResult);
        });
      }
    }
  }, [evaluationResult, field.answer, ctrl.api.field]);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f }) => {
        if (isPreview) {
          return (
            <div className="expression-field-preview space-y-2 pb-4">
              {f.label && <div className="expression-label font-light text-sm text-gray-600">{f.label}</div>}
              <div className="expression-preview-box p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Expression:</span> {f.expression || "No expression defined"}
                </p>
                {evaluationResult.result != null && (
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    <span className="text-sm text-gray-600">Result: </span>
                    {formatResult(evaluationResult.result, f.displayFormat, f.decimalPlaces)}
                  </p>
                )}
                {evaluationResult.error && (
                  <p className="text-sm text-red-600 mt-2">Error: {evaluationResult.error}</p>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="expression-field-editor space-y-4 w-full">
            {/* Label */}
            <div className="label-field">
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
            <div className="expression-field">
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
                <p className="expression-error text-xs text-red-600 mt-1">Error: {samplePreview.error}</p>
              ) : (
                <p className="expression-help text-xs text-gray-500 mt-1">
                  Use {'{fieldId}'} to reference other fields. Arithmetic: {'{price} * {quantity}'}. Comparison: {'{age} >= 18'} → true/false. "contains" is not supported for numeric fields.
                </p>
              )}
            </div>

            {/* Display Format */}
            <div className="display-format-field">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Format
              </label>
              <select
                className="display-format px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none cursor-pointer transition-colors"
                value={f.displayFormat || "number"}
                onChange={(e) => api.field.update("displayFormat", e.target.value)}
              >
                <option value="number">Number</option>
                <option value="currency">Currency ($)</option>
                <option value="percentage">Percentage (%)</option>
                <option value="boolean">Boolean (true/false)</option>
              </select>
            </div>

            {/* Decimal Places (for all numeric formats) */}
            <div className="decimal-places-field">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decimal Places
              </label>
              <input
                className="decimal-places px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                type="number"
                min="0"
                max="10"
                value={f.decimalPlaces || 2}
                onChange={(e) => api.field.update("decimalPlaces", parseInt(e.target.value, 10))}
              />
            </div>

            {/* Sample Data for Preview */}
            <div className="sample-data-section border-t pt-4">
              <div className="sample-data-header flex items-center justify-between mb-3">
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
                <div className="sample-data-list space-y-2">
                  {sampleDataFields.map((field, idx) => {
                    // Ensure a stable unique key for React reconciliation
                    const stableKey = field._id || `sample-${field.fieldId || 'empty'}-${idx}`;
                    return (
                      <div key={stableKey} className="sample-data-row flex gap-2 items-end">
                        <div className="field-id-input flex-1">
                          <input
                            className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors text-sm"
                            type="text"
                            value={field.fieldId || ""}
                            onChange={(e) => updateSampleDataField(idx, "fieldId", e.target.value)}
                            placeholder="Field ID (e.g., completed)"
                          />
                        </div>
                        <div className="field-value-input flex-1">
                          <input
                            className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors text-sm"
                            type="text"
                            value={field.value || ""}
                            onChange={(e) => updateSampleDataField(idx, "value", e.target.value)}
                            placeholder="Value (e.g., 8)"
                          />
                        </div>
                        <button
                          onClick={() => removeSampleDataField(idx)}
                          className="remove-sample-btn px-3 py-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Preview Result */}
            {sampleDataFields?.length > 0 && (
              <div className="expression-preview-result p-3 bg-blue-50 border border-blue-300 rounded-lg">
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
