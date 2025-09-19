// ────────── Get the current value of a field for comparisons ──────────
function getFieldValue(f) {
  switch (f?.fieldType) {
    case "input":
      return f.answer ?? "";
    case "radio":
    case "selection":
      return f.selected ?? null;
    case "check":
      // Prefer explicit selected array; else derive from options
      if (Array.isArray(f.selected)) return f.selected;
      return Array.isArray(f.options)
        ? f.options.filter(o => o?.selected).map(o => o.id ?? o.value)
        : [];
    default:
      return null;
  }
}

// ────────── Build an id -> field index (includes children inside sections) ──────────
function indexFields(all) {
  const map = {};
  (all || []).forEach(f => {
    if (!f?.id) return;
    map[f.id] = f;
    if (f.fieldType === "section" && Array.isArray(f.fields)) {
      f.fields.forEach(ch => {
        if (ch?.id) map[ch.id] = ch;
      });
    }
  });
  return map;
}

// ────────── Evaluate a single condition against the current state ──────────
function evalCondition(cond, byId) {
  const target = byId[cond?.targetId];
  if (!target) return false;

  const actual = getFieldValue(target);
  const expected = cond?.value;

  switch (cond?.operator) {
    case "equals":
      if (Array.isArray(actual)) return false;
      return String(actual ?? "") === String(expected ?? "");
    case "contains":
      return String(actual ?? "").toLowerCase().includes(String(expected ?? "").toLowerCase());
    case "includes":
      if (!Array.isArray(actual)) return false;
      return actual.map(String).includes(String(expected));
    default:
      return false;
  }
}

// ────────── Public API used by FormBuilderMain ──────────
export function checkFieldVisibility(field, allFields) {
  const ew = field?.enableWhen;
  // No logic => visible
  if (!ew || !Array.isArray(ew.conditions) || ew.conditions.length === 0) return true;

  const byId = indexFields(allFields);
  const results = ew.conditions.map(c => evalCondition(c, byId));
  const mode = (ew.logic || "AND").toUpperCase();

  return mode === "AND" ? results.every(Boolean) : results.some(Boolean);
}
