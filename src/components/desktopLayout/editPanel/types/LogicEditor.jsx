import React from "react";
import { useUIApi } from "../../../../state/uiApi";
import { useFormStore } from "../../../../state/formStore";

function getOperatorsForFieldType(fieldType) {
  switch (fieldType) {
    case "input":
      return ["equals", "contains"];
    case "radio":
    case "selection":
      return ["equals"];
    case "check":
      return ["includes"];
    default:
      return ["equals"];
  }
}

export default function LogicEditor() {
  const ui = useUIApi();

  const parentId   = ui.selectedChildId.ParentId;
  const childId    = ui.selectedChildId.ChildId;
  const selectedId = ui.selectedFieldId.value;
  const isChild    = !!parentId && !!childId;
  const effectiveId = isChild ? childId : (selectedId ?? null);

  const byId = useFormStore((s) => s.byId);
  const setEnableWhen = useFormStore((s) => s.setEnableWhen);

  const field = React.useMemo(() => {
    if (!effectiveId) return null;
    if (isChild) {
      const section = byId[parentId];
      const list = Array.isArray(section?.fields) ? section.fields : [];
      return list.find((c) => c.id === childId) ?? null;
    }
    return byId[effectiveId] ?? null;
  }, [byId, effectiveId, isChild, parentId, childId]);

  const targets = React.useMemo(() => {
    const out = [];
    for (const f of Object.values(byId)) {
      if (!f) continue;
      if (f.fieldType === "section" && Array.isArray(f.fields)) {
        const sectTitle = f.title?.trim() || "Section";
        f.fields.forEach((c) => {
          out.push({
            id: c.id,
            parentId: f.id,
            label: `${sectTitle} › ${c.question?.trim() || c.id}`,
            fieldType: c.fieldType,
            options: c.options || [],
          });
        });
      } else {
        out.push({
          id: f.id,
          parentId: null,
          label: f.question?.trim() || f.title?.trim() || f.id,
          fieldType: f.fieldType,
          options: f.options || [],
        });
      }
    }
    return out;
  }, [byId]);

  const findTarget = React.useCallback(
    (tid) => targets.find((t) => t.id === tid) || null,
    [targets]
  );

  // ────────── <Comment> Writer (passes sectionId when editing a child) ──────────
  const writeEnableWhen = React.useCallback(
    (next) => {
      if (!effectiveId) return;
      if (isChild) {
        // child field inside a section
        useFormStore.getState().setEnableWhen(effectiveId, next, { sectionId: parentId });
      } else {
        // top-level field
        setEnableWhen(effectiveId, next);
      }
    },
    [effectiveId, isChild, parentId, setEnableWhen]
  );

  if (!field) return null;

  const ew = field.enableWhen || { logic: "AND", conditions: [] };

  // ────────── <Comment> Events ──────────
  const addCond = () => {
    // ────────── only append; do NOT mutate ew.conditions ──────────
    const next = {
      logic: ew.logic || "AND",
      conditions: [
        ...(Array.isArray(ew.conditions) ? ew.conditions : []),
        { targetId: "", operator: "equals", value: "" },
      ],
    };
    writeEnableWhen(next);
  };

  const clear = () => writeEnableWhen(null);

  const removeCond = (idx) => {
    const base = Array.isArray(ew.conditions) ? ew.conditions : [];
    const nextConds = base.filter((_, i) => i !== idx);
    writeEnableWhen({ ...ew, conditions: nextConds });
  };

  const updateCond = (idx, patch) => {
    const base = Array.isArray(ew.conditions) ? ew.conditions : [];
    const nextConds = [...base];
    const curr = nextConds[idx] || { targetId: "", operator: "equals", value: "" };
    const updated = { ...curr, ...patch };

    // ────────── auto-fix operator & value when switching target ──────────
    if ("targetId" in patch) {
      const meta = findTarget(updated.targetId);
      const ops = getOperatorsForFieldType(meta?.fieldType);
      if (!ops.includes(updated.operator)) updated.operator = ops[0] || "equals";
      if (Array.isArray(meta?.options) && meta.options.length > 0) {
        const valid = new Set(meta.options.map((o) => o.id));
        if (!valid.has(updated.value)) updated.value = "";
      } else {
      }
    }

    nextConds[idx] = updated;
    writeEnableWhen({ ...ew, conditions: nextConds });
  };

  // ────────── Prevent self-targeting ──────────
  const filteredTargets = React.useMemo(
    () => targets.filter((t) => t.id !== effectiveId),
    [targets, effectiveId]
  );

  return (
    <div className="space-y-2">
      {/* ────────── Logic header ────────── */}
      <div className="flex gap-2 items-center">
        <label className="text-sm">Logic:</label>
        <select
          value={ew.logic || "AND"}
          onChange={(e) => writeEnableWhen({ ...ew, logic: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <button className="px-2 py-1 border rounded" onClick={addCond}>
          + Condition
        </button>
        <button className="px-2 py-1 border rounded" onClick={clear}>
          Clear
        </button>
      </div>

      {/* ────────── Conditions ────────── */}
      {(Array.isArray(ew.conditions) ? ew.conditions : []).map((c, i) => {
        const meta = findTarget(c.targetId);
        const allowedOps = getOperatorsForFieldType(meta?.fieldType);
        const hasOptions = Array.isArray(meta?.options) && meta.options.length > 0;

        return (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-7 gap-2 items-center">
            {/* Remove */}
            <button
              onClick={() => removeCond(i)}
              className="px-2 py-1 border rounded sm:col-span-1"
              title="Remove condition"
            >
              ✕
            </button>

            {/* Target field selector */}
            <select
              className="border p-1 rounded sm:col-span-3"
              value={c.targetId}
              onChange={(e) => updateCond(i, { targetId: e.target.value })}
            >
              <option value="">— Select field —</option>
              {filteredTargets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            {/* Operator */}
            <select
              className="border p-1 rounded sm:col-span-1"
              value={c.operator}
              onChange={(e) => updateCond(i, { operator: e.target.value })}
              disabled={!meta}
            >
              {(meta ? allowedOps : ["equals"]).map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>

            {/* Value: select for options, text for inputs */}
            {hasOptions ? (
              <select
                className="border p-1 rounded sm:col-span-2"
                value={c.value}
                onChange={(e) => updateCond(i, { value: e.target.value })}
                disabled={!meta}
              >
                <option value="">— Select option —</option>
                {meta.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.value}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="border p-1 rounded sm:col-span-2"
                placeholder="Enter value"
                value={c.value}
                onChange={(e) => updateCond(i, { value: e.target.value })}
                disabled={!meta}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
