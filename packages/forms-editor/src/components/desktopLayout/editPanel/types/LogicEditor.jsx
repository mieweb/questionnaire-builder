import React from "react";
import { useUIApi, useFormStore } from "@mieweb/forms-engine";

// ────────── <Comment> Operators by field type ──────────
function getOperatorsForFieldType(fieldType) {
  switch (fieldType) {
    case "input": return ["equals", "contains"];
    case "radio":
    case "selection": return ["equals"];
    case "check": return ["includes"];
    default: return ["equals"];
  }
}

// ────────── <Comment> Normalize options ──────────
function normOption(opt) {
  if (opt && typeof opt === "object") {
    const id = opt.id ?? String(opt.value ?? "");
    const value = String(opt.value ?? opt.label ?? opt.id ?? "");
    return { id, value };
  }
  const s = String(opt ?? "");
  return { id: s, value: s };
}

export default function LogicEditor() {
  const ui = useUIApi();

  // stable store slices (hooks always called)
  const byId = useFormStore((s) => s.byId);
  const setEnableWhen = useFormStore((s) => s.setEnableWhen);
  const updateField = useFormStore((s) => s.updateField);

  // read selection (plain values)
  const selectedId = ui?.selectedFieldId?.value ?? null;
  const rawParentId = ui?.selectedChildId?.ParentId ?? null;
  const rawChildId = ui?.selectedChildId?.ChildId ?? null;

  // resolve current selected field and whether it is a section
  const selectedField = selectedId ? byId[selectedId] : null;
  const isSectionCtx = selectedField?.fieldType === "section";

  // children list for the current section (empty when not a section)
  const sectionChildren = React.useMemo(() => {
    if (!isSectionCtx) return [];
    const arr = Array.isArray(selectedField?.fields) ? selectedField.fields : [];
    return arr;
  }, [isSectionCtx, selectedField]);

  // validate the previously selected child against current section
  const childValidForSection = React.useMemo(() => {
    if (!isSectionCtx || !rawChildId) return false;
    return sectionChildren.some((c) => c.id === rawChildId);
  }, [isSectionCtx, rawChildId, sectionChildren]);

  // target: "" => section; "child:<id>" => child under current section
  const initialTarget = React.useMemo(() => {
    if (!isSectionCtx) return ""; // treat non-section as "section scope" on that field
    if (childValidForSection) return `child:${rawChildId}`;
    return "";
  }, [isSectionCtx, childValidForSection, rawChildId]);

  const [target, setTarget] = React.useState(initialTarget);

  // keep target in sync when switching selected field/section
  React.useEffect(() => {
    setTarget(initialTarget);
  }, [initialTarget]);

  // sync UI child selection for other panels (no-op if not a section)
  React.useEffect(() => {
    if (!isSectionCtx) return;
    if (target && target.startsWith("child:")) {
      const cid = target.slice(6);
      ui.selectedChildId.set(selectedId, cid);
    } else {
      ui.selectedChildId.set(null, null);
    }
  }, [isSectionCtx, target, selectedId, ui]);

  // compute effective scope
  const isChildScope = Boolean(isSectionCtx && target && target.startsWith("child:"));
  const effectiveChildId = isChildScope ? target.slice(6) : null;
  const effectiveId = isChildScope ? effectiveChildId : selectedId;

  // read the field we're editing logic for (may be null; we still render safely)
  const field = React.useMemo(() => {
    if (!effectiveId) return null;
    if (isChildScope) {
      return sectionChildren.find((c) => c.id === effectiveChildId) ?? null;
    }
    return byId[effectiveId] ?? null;
  }, [byId, effectiveId, isChildScope, effectiveChildId, sectionChildren]);

  // Build list of possible condition targets (all fields, including children)
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
            options: Array.isArray(c.options) ? c.options : [],
          });
        });
      } else {
        out.push({
          id: f.id,
          parentId: null,
          label: f.question?.trim() || f.title?.trim() || f.id,
          fieldType: f.fieldType,
          options: Array.isArray(f.options) ? f.options : [],
        });
      }
    }
    return out;
  }, [byId]);

  const findTarget = React.useCallback(
    (tid) => targets.find((t) => t.id === tid) || null,
    [targets]
  );

  // writer: section/top-level vs child
  const writeEnableWhen = React.useCallback(
    (next) => {
      if (!effectiveId) return;

      const normalized =
        next && Array.isArray(next.conditions)
          ? { logic: next.logic || "AND", conditions: next.conditions }
          : undefined;

      if (isChildScope && selectedId) {
        updateField(effectiveId, { enableWhen: normalized }, { sectionId: selectedId });
      } else {
        setEnableWhen(effectiveId, normalized);
      }
    },
    [effectiveId, isChildScope, selectedId, setEnableWhen, updateField]
  );

  // current ew (safe default even if field null)
  const ew = React.useMemo(() => {
    return field?.enableWhen && Array.isArray(field.enableWhen.conditions)
      ? { logic: field.enableWhen.logic || "AND", conditions: field.enableWhen.conditions }
      : { logic: "AND", conditions: [] };
  }, [field]);

  // events (pure; never add/remove hooks)
  const addCond = React.useCallback(() => {
    const next = {
      logic: ew.logic || "AND",
      conditions: [
        ...(Array.isArray(ew.conditions) ? ew.conditions : []),
        { targetId: "", operator: "equals", value: "" },
      ],
    };
    writeEnableWhen(next);
  }, [ew, writeEnableWhen]);

  const clear = React.useCallback(() => writeEnableWhen(null), [writeEnableWhen]);

  const removeCond = React.useCallback(
    (idx) => {
      const base = Array.isArray(ew.conditions) ? ew.conditions : [];
      const nextConds = base.filter((_, i) => i !== idx);
      writeEnableWhen({ ...ew, conditions: nextConds });
    },
    [ew, writeEnableWhen]
  );

  const updateCond = React.useCallback(
    (idx, patch) => {
      const base = Array.isArray(ew.conditions) ? ew.conditions : [];
      const nextConds = [...base];
      const curr = nextConds[idx] || { targetId: "", operator: "equals", value: "" };
      const updated = { ...curr, ...patch };

      if ("targetId" in patch) {
        const meta = findTarget(updated.targetId);
        const ops = getOperatorsForFieldType(meta?.fieldType);
        if (!ops.includes(updated.operator)) updated.operator = ops[0] || "equals";

        const opts = Array.isArray(meta?.options) ? meta.options.map(normOption) : [];
        if (opts.length > 0) {
          const valid = new Set(opts.map((o) => o.id));
          if (!valid.has(updated.value)) updated.value = "";
        }
      }

      nextConds[idx] = updated;
      writeEnableWhen({ ...ew, conditions: nextConds });
    },
    [ew, findTarget, writeEnableWhen]
  );

  // filteredTargets: prevent self-targeting
  const filteredTargets = React.useMemo(
    () => targets.filter((t) => t.id !== effectiveId),
    [targets, effectiveId]
  );

  // ────────── Render (no early return before hooks) ──────────
  const isDisabled = !field || !effectiveId;

  return (
    <div className="space-y-2">
      {/* Target picker when a section is selected */}
      {isSectionCtx && (
        <div className="flex gap-2 items-center">
          <label className="text-sm">Target:</label>
          <select
            className="border p-1 rounded"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="">Section (this)</option>
            {sectionChildren.map((c) => (
              <option key={c.id} value={`child:${c.id}`}>
                {c.question?.trim() || c.title?.trim() || c.id}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <label className="text-sm">Logic:</label>
        <select
          value={ew.logic || "AND"}
          onChange={(e) => writeEnableWhen({ ...ew, logic: e.target.value })}
          className="border p-1 rounded"
          disabled={isDisabled}
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <button type="button" className="px-2 py-1 border rounded" onClick={addCond} disabled={isDisabled}>
          + Condition
        </button>
        <button type="button" className="px-2 py-1 border rounded" onClick={clear} disabled={isDisabled}>
          Clear
        </button>
      </div>

      {/* Conditions list (render safely even if disabled) */}
      {(Array.isArray(ew.conditions) ? ew.conditions : []).map((c, i) => {
        const meta = findTarget(c.targetId);
        const allowedOps = getOperatorsForFieldType(meta?.fieldType);
        const optList = Array.isArray(meta?.options) ? meta.options.map(normOption) : [];
        const hasOptions = optList.length > 0;

        return (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-7 gap-2 items-center opacity-100">
            <button
              type="button"
              onClick={() => removeCond(i)}
              className="px-2 py-1 border rounded sm:col-span-1"
              title="Remove condition"
              disabled={isDisabled}
            >
              ✕
            </button>

            <select
              className="border p-1 rounded sm:col-span-3"
              value={c.targetId}
              onChange={(e) => updateCond(i, { targetId: e.target.value })}
              disabled={isDisabled}
            >
              <option value="">— Select field —</option>
              {filteredTargets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <select
              className="border p-1 rounded sm:col-span-1"
              value={c.operator}
              onChange={(e) => updateCond(i, { operator: e.target.value })}
              disabled={isDisabled || !meta}
            >
              {(meta ? allowedOps : ["equals"]).map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>

            {hasOptions ? (
              <select
                className="border p-1 rounded sm:col-span-2"
                value={c.value}
                onChange={(e) => updateCond(i, { value: e.target.value })}
                disabled={isDisabled || !meta}
              >
                <option value="">— Select option —</option>
                {optList.map((opt) => (
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
                disabled={isDisabled || !meta}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
