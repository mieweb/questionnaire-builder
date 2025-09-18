// ────────── Resolve target via path (sections) + fieldId ──────────
function findFieldByPath(allFields, pathIds, fieldId) {
  let levelNodes = allFields;
  for (const secId of (pathIds || [])) {
    const sec = (levelNodes || []).find(n => n.id === secId && n.fieldType === "section");
    if (!sec) return null;
    levelNodes = Array.isArray(sec.fields) ? sec.fields : [];
  }
  const targetList = levelNodes || allFields;
  return (targetList || []).find(n => n.id === fieldId) || null;
}

// ────────── Legacy: flat index by id (still supported) ──────────
function indexAllFields(all) {
  const map = {};
  (all || []).forEach(f => {
    map[f.id] = f;
    if (f.fieldType === "section" && Array.isArray(f.fields)) {
      f.fields.forEach(c => { map[c.id] = c; });
    }
  });
  return map;
}

function getFieldCurrentValue(f) {
  switch (f?.fieldType) {
    case "input": return f.answer ?? "";
    case "radio":
    case "selection": return f.selected ?? null;
    case "check":
      if (Array.isArray(f.selected)) return f.selected;
      return Array.isArray(f.options)
        ? f.options.filter(o => o?.selected).map(o => o.id ?? o.value)
        : [];
    default: return null;
  }
}

function evalCondition(cond, allFields, byIdIndex) {
  // ────────── Prefer path resolution if provided ──────────
  let trigger = null;
  if (Array.isArray(cond.path) && cond.path.length) {
    trigger = findFieldByPath(allFields, cond.path, cond.fieldId);
  } else if (cond.fieldId) {
    trigger = byIdIndex[cond.fieldId];
  }
  if (!trigger) return false;

  const val = getFieldCurrentValue(trigger);
  const expected = cond.value;

  switch (cond.operator) {
    case "equals":
      if (Array.isArray(val)) return false;
      return String(val ?? "") === String(expected ?? "");
    case "contains":
      return String(val ?? "").toLowerCase().includes(String(expected ?? "").toLowerCase());
    case "includes":
      if (!Array.isArray(val)) return false;
      return val.map(String).includes(String(expected));
    default:
      return false;
  }
}

export function checkFieldVisibility(field, allFields) {
  const ew = field?.enableWhen;
  if (!ew || !Array.isArray(ew.conditions) || ew.conditions.length === 0) return true;

  const byId = indexAllFields(allFields);
  const results = ew.conditions.map(c => evalCondition(c, allFields, byId));
  const mode = (ew.logic || "AND").toUpperCase();
  return mode === "AND" ? results.every(Boolean) : results.some(Boolean);
}
