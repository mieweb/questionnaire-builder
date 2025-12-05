// ────────── Get a field's current value for comparison ──────────
function getValueOf(field) {
  switch (field?.fieldType) {
    case "text":
    case "longtext":
      return field.answer ?? "";
    case "expression":
      // Expression fields store their answer as the evaluation result
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

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// ────────── Evaluate a single condition ──────────
function evaluate(cond, byId) {
  const target = byId?.[cond?.targetId];
  if (!target) return false;

  const actual = getValueOf(target);
  const expected = cond?.value;

  switch (cond?.operator) {
    case "equals":
      if (Array.isArray(actual)) return false;
      return String(actual ?? "") === String(expected ?? "");
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
