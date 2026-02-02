import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import { useFormStore } from "../state/formStore";
import { NUMERIC_EXPRESSION_FORMATS } from "../helper_shared/fieldTypes-config";
import CustomCheckbox from "../helper_shared/CustomCheckbox";

// Helper: Check if all referenced fields exist (they can be empty)
const hasAllFields = (expression, data) => {
  const fieldRefs = expression.match(/\{(\w+)\}/g) || [];
  return fieldRefs.every(ref => {
    const fieldId = ref.slice(1, -1);
    return data[fieldId] !== undefined && data[fieldId] !== null;
  });
};

// Helper: Parse expression into tokens (string literals vs expressions)
const tokenizeExpression = (expression) => {
  const tokens = [];
  let current = "";
  let inQuote = null;
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if (!inQuote && (char === "'" || char === '"')) {
      // Starting a quoted string
      if (current.trim()) tokens.push({ type: "expr", value: current.trim() });
      current = "";
      inQuote = char;
    } else if (inQuote && char === inQuote) {
      // Ending a quoted string
      tokens.push({ type: "string", value: current });
      current = "";
      inQuote = null;
    } else {
      current += char;
    }
  }
  
  if (current.trim()) tokens.push({ type: "expr", value: current.trim() });
  return tokens;
};

// Helper: Evaluate a pure numeric/field expression (no string literals)
const evaluatePureExpression = (expr, data) => {
  // First, convert bracket syntax [text] to quoted strings for evaluation
  // Special cases: [] becomes "", <nl> becomes literal "<nl>" string (split later for display)
  let processed = expr.replace(/\[\]/g, '""').replace(/<nl>/g, '"<nl>"').replace(/\[([^\]]+)\]/g, '"$1"');
  
  // Substitute field references with values
  const substituted = processed.replace(/\{(\w+)\}/g, (_, fieldId) => {
    const val = data[fieldId];
    if (val === undefined || val === null || val === "") return '""';
    return typeof val === "number" ? val : `"${val}"`;
  });
  
  // Clean up any remaining operators at edges (from concatenation cleanup)
  const cleaned = substituted.replace(/^\s*\+\s*/, "").replace(/\s*\+\s*$/, "").trim();
  if (!cleaned) return "";
  
  // Evaluate directly - Function() constructor will throw if syntax is invalid
  // No need to validate characters since we've already substituted safe values
  try {
    const result = Function('"use strict"; return (' + cleaned + ')')();
    return result;
  } catch (e) {
    console.error('Eval error:', e.message, 'Expression:', cleaned);
    throw new Error("Invalid expression");
  }
};

// Helper: Evaluate if-then-else expression (supports nesting)
const evaluateIfThenElse = (expression, data) => {
  // Match: if condition then trueVal else falseVal
  // Need to balance then/else pairs for nested if-then-else
  const match = expression.match(/^if\s+/i);
  if (!match) return null;
  
  let depth = 0;
  let conditionEnd = -1;
  let thenEnd = -1;
  let i = 3; // Skip "if "
  
  // Find the condition (up to matching 'then')
  while (i < expression.length) {
    const remaining = expression.substring(i);
    if (/^if\s+/i.test(remaining)) {
      depth++;
      i += 3;
    } else if (/^then\s+/i.test(remaining)) {
      if (depth === 0) {
        conditionEnd = i;
        i += 5; // Skip "then "
        break;
      }
      depth--;
      i += 5;
    } else {
      i++;
    }
  }
  
  if (conditionEnd === -1) return null;
  
  // Find the trueVal (up to matching 'else')
  depth = 0;
  while (i < expression.length) {
    const remaining = expression.substring(i);
    if (/^if\s+/i.test(remaining)) {
      depth++;
      i += 3;
    } else if (/^then\s+/i.test(remaining)) {
      i += 5;
    } else if (/^else\s+/i.test(remaining)) {
      if (depth === 0) {
        thenEnd = i;
        i += 5; // Skip "else "
        break;
      }
      depth--;
      i += 5;
    } else {
      i++;
    }
  }
  
  if (thenEnd === -1) return null;
  
  const condition = expression.substring(3, conditionEnd).trim();
  const trueVal = expression.substring(conditionEnd + 5, thenEnd).trim();
  const falseVal = expression.substring(i).trim();
  
  // Evaluate the condition
  const condResult = evaluatePureExpression(condition, data);
  
  // Get the appropriate value
  const resultExpr = condResult ? trueVal : falseVal;
  
  // If it's a quoted string, return the string content
  const stringMatch = resultExpr.match(/^(['"])(.*)\1$/);
  if (stringMatch) return stringMatch[2];
  
  // Otherwise evaluate it (might be nested if-then-else)
  if (/^if\s+/i.test(resultExpr)) {
    return evaluateIfThenElse(resultExpr, data);
  }
  
  return evaluatePureExpression(resultExpr, data);
};

// Main evaluation function
const evaluateExpression = (expression, data = {}) => {
  if (!expression) return { result: "", error: "" };
  
  // If referenced fields are missing, return empty (not error)
  if (!hasAllFields(expression, data)) {
    return { result: "", error: "" };
  }
  
  try {
    // Check for if-then-else syntax
    if (/\bif\s+/i.test(expression)) {
      const result = evaluateIfThenElse(expression.trim(), data);
      if (result !== null) return { result, error: "" };
    }
    
    // Check if expression has string concatenation (quotes OUTSIDE of comparisons)
    // Don't tokenize if quotes are only inside comparisons like =='yes'
    const hasStringConcatenation = /['"].*?\+|^\s*['"]|[^=!<>]['"]/.test(expression);
    
    if (hasStringConcatenation) {
      // Parse into tokens and evaluate each part
      const tokens = tokenizeExpression(expression);
      const results = tokens.map(token => {
        if (token.type === "string") {
          return token.value;
        } else {
          // Evaluate the expression part
          const val = evaluatePureExpression(token.value, data);
          return val === undefined || val === null ? "" : String(val);
        }
      });
      return { result: results.join(""), error: "" };
    }
    
    // Pure numeric/boolean expression
    const result = evaluatePureExpression(expression, data);
    return { result, error: "" };
    
  } catch (error) {
    return { result: "", error: error.message || "Invalid expression" };
  }
};

// Helper: Format result based on display type
const formatResult = (value, format, decimals = 2) => {
  if (value === undefined || value === null) return "";
  
  // String format - return as-is
  if (format === "string") return String(value);
  
  // Boolean format
  if (format === "boolean") return value ? "true" : "false";
  
  // Numeric formats - only format if it's actually a number
  const num = parseFloat(value);
  if (!Number.isFinite(num)) {
    return String(value);
  }
  
  if (format === "currency") return `$${num.toFixed(decimals)}`;
  if (format === "percentage") return `${num.toFixed(decimals)}%`;
  if (format === "number") return num.toFixed(decimals);
  
  // Default: return as-is
  return String(value);
};

// Helper: Get the display value for a field based on its type
const getFieldDisplayValue = (field) => {
  if (!field) return "";
  
  // Get raw value from answer or selected
  let value = field.answer != null && field.answer !== "" 
    ? field.answer 
    : field.selected;
  
  // For fields with options, resolve ID to display value
  if (field.options && value != null && value !== "") {
    // Rating fields: resolve to numeric value
    if (field.fieldType === "rating") {
      const selectedOption = field.options.find(opt => opt.id === value || opt.text === value);
      if (selectedOption && selectedOption.value != null) {
        return selectedOption.value;
      }
    }
    // Radio, dropdown, boolean: resolve to text value
    else if (field.fieldType === "radio" || field.fieldType === "dropdown" || field.fieldType === "boolean") {
      const selectedOption = field.options.find(opt => opt.id === value);
      if (selectedOption) {
        return selectedOption.value || selectedOption.text || value;
      }
    }
    // Checkbox, multiselect: resolve array of IDs to text values
    else if (field.fieldType === "check" || field.fieldType === "multiselectdropdown") {
      const values = Array.isArray(value) ? value : [value];
      const resolved = values.map(v => {
        const opt = field.options.find(opt => opt.id === v);
        return opt ? (opt.value || opt.text || v) : v;
      });
      return resolved.join(", ");
    }
  }
  
  // For unselected rating fields, default to 0 for calculations
  if (field.fieldType === "rating" && (value == null || value === "")) {
    return 0;
  }
  
  // Default: return value as-is (or empty string if null)
  return value ?? "";
};

// Helper: Build data object from form fields
const buildFieldData = (order, byId, excludeId) => {
  const data = {};
  order.forEach((id) => {
    const fld = byId[id];
    if (!fld || fld.id === excludeId) return;
    
    const value = getFieldDisplayValue(fld);
    const parsed = parseFloat(value);
    data[fld.id] = !Number.isNaN(parsed) ? parsed : value;
    
    if (fld.fieldType === "section" && fld.fields) {
      fld.fields.forEach((child) => {
        if (child.id !== excludeId) {
          const childValue = getFieldDisplayValue(child);
          const parsed = parseFloat(childValue);
          data[child.id] = !Number.isNaN(parsed) ? parsed : childValue;
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
      
      const { result, error } = evaluateExpression(field.expression, sampleData);
      if (error) return { result: "", error };
      
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

  // Build stable representation of field data to prevent feedback loops
  const fieldDataString = React.useMemo(() => {
    if (!ctrl.isPreview) return "";
    const data = buildFieldData(order, byId, field.id);
    return JSON.stringify(data);
  }, [ctrl.isPreview, order, byId, field.id]);

  // Computed result for preview mode
  const evaluationResult = React.useMemo(() => {
    if (!ctrl.isPreview || !field.expression) return { result: "", error: "" };
    const actualData = fieldDataString ? JSON.parse(fieldDataString) : {};
    return evaluateExpression(field.expression, actualData);
  }, [ctrl.isPreview, field.expression, fieldDataString]);

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
      {({ api, isPreview, field: f, instanceId }) => {
        if (isPreview) {
          return (
            <div className="expression-field-preview mie:space-y-2 mie:pb-4">
              {f.label && <div className="expression-label mie:font-light mie:text-sm mie:text-mietextmuted">{f.label}</div>}
              {f.hideDebugInfo ? (
                // Show only result
                evaluationResult.result != null && (
                  <div className="mie:flex mie:flex-col mie:gap-1">
                    {formatResult(evaluationResult.result, f.displayFormat, f.decimalPlaces).split('<nl>').map((line, i) => (
                      <p key={i} className="mie:text-lg mie:font-semibold mie:text-mieprimary">{line}</p>
                    ))}
                  </div>
                )
              ) : (
                // Show expression and result with labels
                <div className="expression-preview-box mie:p-3 mie:bg-miebackground mie:border mie:border-mieborder mie:rounded-lg">
                  <p className="mie:text-sm mie:text-mietextmuted mie:mb-1">
                    <span className="mie:font-medium">Expression:</span> {f.expression || "No expression defined"}
                  </p>
                  {evaluationResult.result != null && (
                    <div className="mie:flex mie:flex-col mie:gap-1 mie:mt-2">
                      <span className="mie:text-sm mie:text-mietextmuted">Result: </span>
                      {formatResult(evaluationResult.result, f.displayFormat, f.decimalPlaces).split('<nl>').map((line, i) => (
                        <p key={i} className="mie:text-lg mie:font-semibold mie:text-mieprimary">{line}</p>
                      ))}
                    </div>
                  )}
                  {evaluationResult.error && (
                    <p className="mie:text-sm mie:text-miedanger mie:mt-2">Error: {evaluationResult.error}</p>
                  )}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="expression-field-editor mie:space-y-4 mie:w-full">
            {/* Label */}
            <div className="label-field">
              <label htmlFor={`${instanceId}-expression-label-${f.id}`} className="mie:block mie:text-sm mie:font-medium mie:text-mietextmuted mie:mb-1">
                Label (Optional)
              </label>
              <input
                id={`${instanceId}-expression-label-${f.id}`}
                aria-label="Label (Optional)"
                className="mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
                type="text"
                value={f.label || ""}
                onChange={(e) => api.field.update("label", e.target.value)}
                placeholder="Enter field label..."
              />
            </div>

            {/* Expression Input */}
            <div className="expression-field">
              <label htmlFor={`${instanceId}-expression-formula-${f.id}`} className="mie:block mie:text-sm mie:font-medium mie:text-mietextmuted mie:mb-1">
                Expression / Formula
              </label>
              <textarea
                id={`${instanceId}-expression-formula-${f.id}`}
                aria-label="Expression / Formula"
                className="mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors mie:font-mono mie:text-sm"
                value={f.expression || ""}
                onChange={(e) => api.field.update("expression", e.target.value)}
                placeholder="{fieldId1} + {fieldId2}"
                rows={4}
              />
              {samplePreview.error ? (
                <p className="expression-error mie:text-xs mie:text-miedanger mie:mt-1">Error: {samplePreview.error}</p>
              ) : (
                <p className="expression-help mie:text-xs mie:text-mietextmuted mie:mt-1">
                  Use {'{fieldId}'} to reference other fields. Arithmetic: {'{price} * {quantity}'}. Comparison: {'{age} >= 18'} → true/false. "contains" is not supported for numeric fields.
                </p>
              )}
            </div>

            {/* Display Format */}
            <div className="display-format-field">
              <label htmlFor={`${instanceId}-expression-format-${f.id}`} className="mie:block mie:text-sm mie:font-medium mie:text-mietextmuted mie:mb-1">
                Display Format
              </label>
              <select
                id={`${instanceId}-expression-format-${f.id}`}
                aria-label="Display Format"
                className="display-format mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:cursor-pointer mie:transition-colors"
                value={f.displayFormat || "number"}
                onChange={(e) => api.field.update("displayFormat", e.target.value)}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="currency">Currency ($)</option>
                <option value="percentage">Percentage (%)</option>
                <option value="boolean">Boolean (true/false)</option>
              </select>
            </div>

            {/* Decimal Places (only show for numeric formats) */}
            {NUMERIC_EXPRESSION_FORMATS.includes(f.displayFormat) && (
              <div className="decimal-places-field">
                <label htmlFor={`${instanceId}-expression-decimals-${f.id}`} className="mie:block mie:text-sm mie:font-medium mie:text-mietextmuted mie:mb-1">
                  Decimal Places
                </label>
                <input
                  id={`${instanceId}-expression-decimals-${f.id}`}
                  aria-label="Decimal Places"
                  className="decimal-places mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
                  type="number"
                  min="0"
                  max="10"
                  value={f.decimalPlaces || 2}
                  onChange={(e) => api.field.update("decimalPlaces", parseInt(e.target.value, 10))}
                />
              </div>
            )}

            {/* Hide Debug Info */}
            <div className="hide-debug-info-field mie:flex mie:items-center mie:gap-2">
              <CustomCheckbox
                id={`${instanceId}-expression-hidedebug-${f.id}`}
                checked={f.hideDebugInfo || false}
                onChange={(checked) => api.field.update("hideDebugInfo", checked)}
                size="md"
              />
              <label htmlFor={`${instanceId}-expression-hidedebug-${f.id}`} className="mie:text-sm mie:font-medium mie:text-mietext mie:cursor-pointer">
                Hide Expression and Result labels (show result only)
              </label>
            </div>

            {/* Sample Data for Preview */}
            <div className="sample-data-section mie:border-t mie:border-mieborder mie:pt-4">
              <div className="sample-data-header mie:flex mie:items-center mie:justify-between mie:mb-3">
                <span className="mie:block mie:text-sm mie:font-medium mie:text-mietext">
                  Sample Data (for preview testing)
                </span>
                <button
                  onClick={addSampleDataField}
                  className="mie:px-3 mie:py-1 mie:text-xs mie:bg-mieprimary mie:hover:bg-mieprimary/90 mie:text-miesurface mie:rounded mie:transition-colors"
                  aria-label="Add sample data field"
                >
                  + Add Field
                </button>
              </div>

              {(sampleDataFields || []).length === 0 ? (
                <p className="mie:text-sm mie:text-mietextmuted mie:italic">No sample fields added yet. Add fields to preview the expression result.</p>
              ) : (
                <div className="sample-data-list mie:space-y-2">
                  {sampleDataFields.map((field, idx) => {
                    // Ensure a stable unique key for React reconciliation
                    const stableKey = field._id || `sample-${field.fieldId || 'empty'}-${idx}`;
                    return (
                      <div key={stableKey} className="sample-data-row mie:flex mie:gap-2 mie:items-end">
                        <div className="field-id-input mie:flex-1">
                          <input
                            id={`${instanceId}-expression-sampleid-${f.id}-${idx}`}
                            aria-label={`Sample field ID ${idx + 1}`}
                            className="mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors mie:text-sm"
                            type="text"
                            value={field.fieldId || ""}
                            onChange={(e) => updateSampleDataField(idx, "fieldId", e.target.value)}
                            placeholder="Field ID (e.g., completed)"
                          />
                        </div>
                        <div className="field-value-input mie:flex-1">
                          <input
                            id={`${instanceId}-expression-sampleval-${f.id}-${idx}`}
                            aria-label={`Sample field value ${idx + 1}`}
                            className="mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors mie:text-sm"
                            type="text"
                            value={field.value || ""}
                            onChange={(e) => updateSampleDataField(idx, "value", e.target.value)}
                            placeholder="Value (e.g., 8)"
                          />
                        </div>
                        <button
                          onClick={() => removeSampleDataField(idx)}
                          className="remove-sample-btn mie:px-3 mie:py-2 mie:text-xs mie:bg-miedanger/10 mie:hover:bg-miedanger/20 mie:text-miedanger mie:rounded mie:transition-colors"
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
              <div className="expression-preview-result mie:p-3 mie:bg-mieprimary/10 mie:border mie:border-mieprimary/30 mie:rounded-lg">
                <p className="mie:text-sm mie:font-medium mie:text-mietextmuted mie:mb-2">Preview Result:</p>
                {samplePreview.error ? (
                  <p className="mie:text-sm mie:text-miedanger">Error: {samplePreview.error}</p>
                ) : (
                  <div className="mie:flex mie:flex-col mie:gap-1">
                    {(samplePreview.result || "No result").split('<nl>').map((line, i) => (
                      <p key={i} className="mie:text-lg mie:font-semibold mie:text-mieprimary">{line}</p>
                    ))}
                  </div>
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
