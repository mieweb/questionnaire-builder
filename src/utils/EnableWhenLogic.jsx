import React from "react";
import { X_ICON } from "../assets/icons"
import { useUIStore } from "../state/uiStore"
import { useFormStore, useFieldsArray } from "../state/formStore"

// ────────── Operators by field type ──────────
function getOperatorsForFieldType(fieldType) {
  switch (fieldType) {
    case "input": return ["equals", "contains"];
    case "radio": return ["equals"];
    case "check": return ["includes"];
    case "selection": return ["equals"];
    default: return ["equals"];
  }
}

// ────────── Tree helpers ──────────
function getNodeChildren(node) {
  return Array.isArray(node?.fields) ? node.fields : [];
}

function findNodeByIdInList(list, id) {
  return (list || []).find(n => n.id === id) || null;
}

function findFieldByPath(allFields, pathIds, fieldId) {
  // descend sections by path, then pick final child fieldId
  let levelNodes = allFields;
  let currentSection = null;

  for (const sectionId of (pathIds || [])) {
    currentSection = findNodeByIdInList(levelNodes, sectionId);
    if (!currentSection || currentSection.fieldType !== "section") return null;
    levelNodes = getNodeChildren(currentSection);
  }

  // If no fieldId yet, they haven't selected a child
  if (!fieldId) return null;

  // child must be inside the last reached section (or top-level if path empty)
  const searchSpace = currentSection ? getNodeChildren(currentSection) : allFields;
  const child = findNodeByIdInList(searchSpace, fieldId);
  return child || null;
}

function flattenFieldsForTriggers(fields) {
  const out = [];
  function walk(nodes, prefix = []) {
    for (const f of nodes) {
      if (f.fieldType === "section") {
        const label = [...prefix, (f.title || "Section")].join(" ▸ ");
        // include section’s children with section label prefix
        walk(getNodeChildren(f), [...prefix, (f.title || "Section")]);
      } else {
        out.push({
          id: f.id,
          fieldType: f.fieldType,
          label: [...prefix, (f.question || f.title || `Field ${f.id}`)].join(" ▸ "),
          options: f.options
        });
      }
    }
  }
  walk(fields);
  return out;
}

// ────────── Pure UI subcomponent: picks a section path (any depth) ──────────
function PathPicker({ allFields, path, onChangePath }) {
  // build column-by-column selectors from current path
  const levels = [];
  let currentLevel = allFields;

  // existing path levels
  for (let i = 0; i < path.length; i++) {
    const secId = path[i];
    levels.push({
      options: currentLevel.filter(n => n.fieldType === "section"),
      selected: secId
    });
    const chosen = currentLevel.find(n => n.id === secId && n.fieldType === "section");
    currentLevel = getNodeChildren(chosen);
  }

  // add one more level selector to allow going deeper (if there are further sections)
  const hasDeeperSections = currentLevel.some(n => n.fieldType === "section");
  levels.push({
    options: hasDeeperSections ? currentLevel.filter(n => n.fieldType === "section") : [],
    selected: ""
  });

  return (
    <div className="flex flex-col gap-2">
      {levels.map((lvl, idx) => (
        <select
          key={idx}
          value={lvl.selected}
          onChange={(e) => {
            const val = e.target.value;
            // ────────── Update path at this index; truncate deeper levels ──────────
            const next = path.slice(0, idx);
            if (val) next.push(val);
            onChangePath(next);
          }}
          className="border p-2 rounded w-full"
          disabled={lvl.options.length === 0}
        >
          <option value="">{idx === 0 ? "--Select Section (optional)--" : "--Select Nested Section (optional)--"}</option>
          {lvl.options.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.title || `Section ${opt.id}`}</option>
          ))}
        </select>
      ))}
    </div>
  );
}

/**
 * EnableWhenEditor – UI only
 * Rows:
 *  - Row 1: mode toggle + AND/OR + +Condition
 *  - Row 2: either (A) Direct Field + Operator, or (B) Path picker + Child + Operator
 *  - Row 3: Value full-width
 */
function EnableWhenEditor({
  logic,
  conditions,
  allFields,
  flatTriggers,
  onChangeLogic,
  onChangeCondition,
  onAdd,
  onRemove
}) {
  return (
    <div className="relative p-2 border border-gray-300 rounded bg-gray-50 mb-2">
      {/* ────────── Row: Logic + Add ────────── */}
      <div className="flex items-center gap-2 mb-4">
        <label className="font-semibold">Logic:</label>
        <select value={logic} onChange={(e) => onChangeLogic(e.target.value)} className="border p-1 rounded">
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <button onClick={onAdd} className="px-2 py-1 bg-green-200 border rounded">+ Condition</button>
      </div>

      {/* ────────── Conditions ────────── */}
      {conditions.map((cond, idx) => {
        const usePath = Array.isArray(cond.path) && cond.path.length > 0;

        // compute current target field
        const directTarget = !usePath ? flatTriggers.find(t => t.id === cond.fieldId) : null;
        const pathTarget = usePath ? findFieldByPath(allFields, cond.path, cond.fieldId) : null;
        const targetFieldType = (usePath ? pathTarget?.fieldType : directTarget?.fieldType) || undefined;
        const allowedOperators = getOperatorsForFieldType(targetFieldType);

        // options from the selected target (when present)
        const currentSectionLeaf = usePath
          ? cond.path.reduce((nodes, secId, i) => {
              if (!Array.isArray(nodes)) return [];
              const sec = nodes.find(n => n.id === secId && n.fieldType === "section");
              return getNodeChildren(sec);
            }, allFields)
          : null;

        const hasOptions = Array.isArray(pathTarget?.options) || Array.isArray(directTarget?.options);

        return (
          <div key={idx} className="mb-3 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between px-2 py-1 border-b border-gray-100">
              <span className="text-xs text-gray-500">Condition {idx + 1}</span>
              <button onClick={() => onRemove(idx)} className="px-2 py-1">
                <X_ICON className="cursor-pointer" />
              </button>
            </div>

            <div className="p-2">
              {/* ────────── Mode toggle ────────── */}
              <div className="mb-2 text-right">
                <button
                  className="text-xs underline text-gray-500"
                  onClick={() => {
                    if (usePath) {
                      // switch to direct
                      onChangeCondition(idx, "path", []);
                      onChangeCondition(idx, "fieldId", "");
                      onChangeCondition(idx, "operator", "equals");
                      onChangeCondition(idx, "value", "");
                    } else {
                      // switch to path (start empty path)
                      onChangeCondition(idx, "path", []);
                      onChangeCondition(idx, "fieldId", "");
                      onChangeCondition(idx, "operator", "equals");
                      onChangeCondition(idx, "value", "");
                    }
                  }}
                >
                  {usePath ? "Use direct field" : "Use section path → child"}
                </button>
              </div>

              {/* ────────── Row 1: selectors ────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {usePath ? (
                  <>
                    {/* Left: dynamic section path */}
                    <div>
                      <PathPicker
                        allFields={allFields}
                        path={cond.path || []}
                        onChangePath={(nextPath) => {
                          onChangeCondition(idx, "path", nextPath);
                          onChangeCondition(idx, "fieldId", "");
                          onChangeCondition(idx, "operator", "equals");
                          onChangeCondition(idx, "value", "");
                        }}
                      />
                    </div>

                    {/* Right: child field at current leaf section */}
                    <select
                      value={cond.fieldId || ""}
                      onChange={(e) => onChangeCondition(idx, "fieldId", e.target.value)}
                      className="border p-2 rounded w-full"
                      disabled={!Array.isArray(currentSectionLeaf)}
                    >
                      <option value="">--Select Child Field--</option>
                      {(currentSectionLeaf || []).filter(n => n.fieldType !== "section").map(ch => (
                        <option key={ch.id} value={ch.id}>
                          {ch.question || ch.title || `Field ${ch.id}`}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    {/* Left: direct field (flattened with breadcrumbs) */}
                    <select
                      value={cond.fieldId || ""}
                      onChange={(e) => {
                        onChangeCondition(idx, "path", []); // ensure cleared
                        onChangeCondition(idx, "fieldId", e.target.value);
                      }}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">--Select Field--</option>
                      {flatTriggers.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>

                    {/* Right: operator */}
                    <select
                      value={cond.operator}
                      onChange={(e) => onChangeCondition(idx, "operator", e.target.value)}
                      className="border p-2 rounded w-full"
                      disabled={!targetFieldType}
                    >
                      {targetFieldType
                        ? allowedOperators.map(op => <option key={op} value={op}>{op}</option>)
                        : <option value="">--Pick Field First--</option>}
                    </select>
                  </>
                )}
              </div>

              {/* ────────── Row 2: operator (path flow only, full width) ────────── */}
              {usePath && (
                <div className="mt-2">
                  <select
                    value={cond.operator}
                    onChange={(e) => onChangeCondition(idx, "operator", e.target.value)}
                    className="border p-2 rounded w-full"
                    disabled={!targetFieldType}
                  >
                    {targetFieldType
                      ? allowedOperators.map(op => <option key={op} value={op}>{op}</option>)
                      : <option value="">--Pick Child First--</option>}
                  </select>
                </div>
              )}

              {/* ────────── Row 3: value (full width) ────────── */}
              <div className="mt-2">
                {hasOptions ? (
                  <select
                    value={cond.value || ""}
                    onChange={(e) => onChangeCondition(idx, "value", e.target.value)}
                    className="border p-2 rounded w-full"
                    disabled={!targetFieldType}
                  >
                    <option value="">--Select Option--</option>
                    {(pathTarget?.options || directTarget?.options || []).map((opt) => (
                      <option key={opt.id ?? opt.value ?? String(opt)} value={opt.id ?? opt.value ?? String(opt)}>
                        {opt.value ?? opt.label ?? String(opt)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="border p-2 rounded w-full"
                    placeholder="Enter value"
                    value={cond.value || ""}
                    onChange={(e) => onChangeCondition(idx, "value", e.target.value)}
                    disabled={!targetFieldType}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ────────── Container ────────── */
export default function EnableWhenLogic() {
  const selectedFieldId = useUIStore((s) => s.selectedFieldId);
  const selectedField = useFormStore((s) => (selectedFieldId ? s.byId[selectedFieldId] : null));
  const updateField = useFormStore((s) => s.updateField);
  const allFields = useFieldsArray();

  if (!selectedField) return null;

  const existing = selectedField.enableWhen || { logic: "AND", conditions: [] };
  const [logic, setLogic] = React.useState(existing.logic || "AND");
  const [conditions, setConditions] = React.useState(existing.conditions || []);

  const prev = React.useRef({ logic: existing.logic, conditions: existing.conditions });

  React.useEffect(() => {
    if (
      existing.logic !== prev.current.logic ||
      JSON.stringify(existing.conditions) !== JSON.stringify(prev.current.conditions)
    ) {
      setLogic(existing.logic || "AND");
      setConditions(existing.conditions || []);
      prev.current = { logic: existing.logic, conditions: existing.conditions };
    }
  }, [selectedField?.id, existing.logic, existing.conditions]);

  const sync = (nextLogic, nextConds) => {
    updateField(selectedFieldId, { enableWhen: { logic: nextLogic, conditions: nextConds } });
  };

  const onChangeLogic = (val) => { setLogic(val); sync(val, conditions); };
  const onAdd = () => {
    const next = [...conditions, { path: [], fieldId: "", operator: "equals", value: "" }];
    setConditions(next); sync(logic, next);
  };
  const onRemove = (idx) => {
    const next = conditions.filter((_, i) => i !== idx);
    setConditions(next); sync(logic, next);
  };
  const onChangeCondition = (idx, key, value) => {
    const next = conditions.map((c, i) => {
      if (i !== idx) return c;
      const updated = { ...c, [key]: value };

      // ────────── When path changes, reset dependent fields ──────────
      if (key === "path") {
        updated.fieldId = "";
        updated.operator = "equals";
        updated.value = "";
      }

      // ────────── When field changes, set operator based on type ──────────
      if (key === "fieldId") {
        // try path target first
        const target = (Array.isArray(updated.path) && updated.path.length)
          ? findFieldByPath(allFields, updated.path, value)
          : flattenFieldsForTriggers(allFields).find(t => t.id === value);

        if (target) {
          const allowed = getOperatorsForFieldType(target.fieldType);
          updated.operator = allowed[0] || "equals";
          updated.value = "";
        }
      }
      return updated;
    });
    setConditions(next); sync(logic, next);
  };

  // Exclude self (and its children if it’s a section) from flat triggers
  const flatTriggers = React.useMemo(() => {
    const filtered = allFields.filter(f => f.id !== selectedFieldId);
    return flattenFieldsForTriggers(filtered);
  }, [allFields, selectedFieldId]);

  return (
    <EnableWhenEditor
      logic={logic}
      conditions={conditions}
      allFields={allFields}
      flatTriggers={flatTriggers}
      onChangeLogic={onChangeLogic}
      onChangeCondition={onChangeCondition}
      onAdd={onAdd}
      onRemove={onRemove}
    />
  );
}
