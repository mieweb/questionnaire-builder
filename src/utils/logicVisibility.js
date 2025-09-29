// ────────── Get a field's current value for comparison ──────────
function getValueOf(field) {
  switch (field?.fieldType) {
    case "input":
      return field.answer ?? "";
    case "radio":
    case "selection":
      return field.selected ?? null;
    case "check":
      if (Array.isArray(field.selected)) return field.selected;
      return Array.isArray(field.options)
        ? field.options.filter(o => o?.selected).map(o => o.id ?? o.value)
        : [];
    default:
      return null;
  }
}

// ────────── <Comment> escape regex special chars ──────────
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
      // build word-boundary style regex over normalized words
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

  // Accept array or map. If array, reduce to a map.
  const byId = Array.isArray(all)
    ? all.reduce((m, f) => { if (f?.id) m[f.id] = f; return m; }, {})
    : all;

  const results = ew.conditions.map(c => evaluate(c, byId));
  const mode = (ew.logic || "AND").toUpperCase();

  return mode === "AND" ? results.every(Boolean) : results.some(Boolean);
}
