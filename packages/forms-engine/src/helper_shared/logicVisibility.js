import { NUMERIC_EXPRESSION_FORMATS } from "./fieldTypes-config";

// ────────── Get a field's current value for comparison ──────────
function getValueOf(field) {
  switch (field?.fieldType) {
    case "text":
    case "longtext":
      return field.answer ?? "";
    case "expression":
      // Expression fields return their answer as-is (may be numeric)
      return field.answer ?? "";
    case "multitext":
      if (Array.isArray(field.options)) {
        return field.options.map(o => o.answer ?? "");
      }
      return [];
    case "radio":
    case "dropdown":
    case "boolean":
    case "slider":
    case "rating":
      return field.selected ?? null;
    case "check":
    case "multiselectdropdown":
    case "multiselect":
    case "ranking":
      if (Array.isArray(field.selected)) return field.selected;
      return Array.isArray(field.options)
        ? field.options.filter(o => o?.selected).map(o => o.id ?? o.value)
        : [];
    case "multimatrix":
    case "singlematrix":
      // Matrix fields store selected as an object: { rowId: colId } (single) or { rowId: [colIds...] } (multi)
      return field.selected ?? {};
    default:
      return null;
  }
}

// ────────── Check if field is numeric expression ──────────
function isNumericExpression(field) {
  if (field?.fieldType !== "expression") return false;
  return NUMERIC_EXPRESSION_FORMATS.includes(field?.displayFormat);
}

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// ────────── Evaluate a single condition ──────────
function evaluate(cond, byId) {
  const target = byId?.[cond?.targetId];
  if (!target) return false;

  let actual = getValueOf(target);
  const expected = cond?.value;

  // Apply property accessor if specified (e.g., .length, .count)
  if (cond?.propertyAccessor) {
    const prop = cond.propertyAccessor.toLowerCase();
    if (prop === 'length' || prop === 'count') {
      if (Array.isArray(actual)) {
        actual = actual.length;
      } else if (typeof actual === 'string') {
        actual = actual.length;
      } else if (typeof actual === 'object' && actual !== null) {
        // For objects, count keys
        actual = Object.keys(actual).length;
      } else {
        actual = 0;
      }
    } else {
      // Unknown property accessor
      return false;
    }
  }

  // For rating/ranking fields with numeric comparisons, resolve the selected option's numeric value
  const numericOperators = ['greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'];
  if (numericOperators.includes(cond?.operator) && 
      (target.fieldType === 'rating' || target.fieldType === 'ranking' || target.fieldType === 'slider')) {
    // actual is an option ID (e.g., "rating-option-7"), find its numeric value
    if (typeof actual === 'string' && Array.isArray(target.options)) {
      const selectedOption = target.options.find(opt => opt.id === actual);
      if (selectedOption && typeof selectedOption.value === 'number') {
        actual = selectedOption.value;
      }
    }
  }

  // Handle empty/notEmpty operators (work with property accessors too)
  if (cond?.operator === 'empty') {
    if (Array.isArray(actual)) return actual.length === 0;
    if (typeof actual === 'object' && actual !== null) return Object.keys(actual).length === 0;
    return !actual || String(actual).trim() === '';
  }
  
  if (cond?.operator === 'notEmpty') {
    if (Array.isArray(actual)) return actual.length > 0;
    if (typeof actual === 'object' && actual !== null) return Object.keys(actual).length > 0;
    return actual && String(actual).trim() !== '';
  }

  // For numeric expressions or numeric comparisons, use numeric logic
  const isNumeric = isNumericExpression(target) || 
                    ['greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'].includes(cond?.operator);
  
  if (isNumeric) {
    const actualNum = parseFloat(actual);
    const expectedNum = parseFloat(expected);
    
    // Handle invalid numbers
    if (isNaN(actualNum) || isNaN(expectedNum)) {
      return false;
    }

    switch (cond?.operator) {
      case "equals":
        return Math.abs(actualNum - expectedNum) < Number.EPSILON * 10;
      case "notEquals":
        return Math.abs(actualNum - expectedNum) >= Number.EPSILON * 10;
      case "greaterThan":
        return actualNum > expectedNum;
      case "greaterThanOrEqual":
        return actualNum >= expectedNum;
      case "lessThan":
        return actualNum < expectedNum;
      case "lessThanOrEqual":
        return actualNum <= expectedNum;
      default:
        return false;
    }
  }

  // Non-numeric comparison (original logic)
  switch (cond?.operator) {
    case "equals":
      if (Array.isArray(actual)) return false;
      return String(actual ?? "") === String(expected ?? "");
      
    case "notEquals":
      if (Array.isArray(actual)) return true;
      return String(actual ?? "") !== String(expected ?? "");
      
    case "contains": {
      const norm = (s) =>
        String(s ?? "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      const hay = norm(actual).replace(/[^a-z0-9]+/g, " ").trim();
      const needle = norm(expected).trim();
      if (!needle) return false;

      const parts = needle.split(/\s+/);
      const pattern =
        parts.length === 1
          ? new RegExp(`(?:^|\\s)${esc(parts[0])}(?:\\s|$)`)
          : new RegExp(`(?:^|\\s)${parts.map((w) => esc(w)).join("\\s+")}(?:\\s|$)`);

      return pattern.test(hay);
    }

    case "includes":
      if (!Array.isArray(actual)) return false;
      return actual.map(String).includes(String(expected));
    default:
      return false;
  }
}

// ────────── Public: isVisible(field, allFieldsArrayOrMap) ──────────
export function isVisible(field, all) {
  const ew = field?.enableWhen;
  if (!ew || !Array.isArray(ew.conditions) || ew.conditions.length === 0) return true;

  const byId = Array.isArray(all)
    ? all.reduce((m, f) => { if (f?.id) m[f.id] = f; return m; }, {})
    : all;

  const results = ew.conditions.map(c => evaluate(c, byId));
  const mode = (ew.logic || "AND").toUpperCase();

  return mode === "AND" ? results.every(Boolean) : results.some(Boolean);
}
