import React from "react";
import { useUIApi, useFormStore, TRASHCANTWO_ICON, NUMERIC_EXPRESSION_FORMATS } from "@mieweb/forms-engine";

// ────────── Operators by field type ──────────
function getOperatorsForFieldType(fieldType, displayFormat, inputType) {
  // Numeric expression fields get comparison operators
  if (fieldType === "expression") {
    const isNumeric = NUMERIC_EXPRESSION_FORMATS.includes(displayFormat);
    if (isNumeric) {
      return ["equals", "notEquals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"];
    }
    return ["equals", "notEquals", "contains", "empty", "notEmpty"];
  }
  
  switch (fieldType) {
    case "text":
    case "longtext":
      // Number, range, and date/time inputs support numeric/comparison operators
      if (inputType === "number" || inputType === "range") {
        return ["equals", "notEquals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual", "empty", "notEmpty"];
      }
      if (inputType === "date" || inputType === "datetime-local" || inputType === "month" || inputType === "time") {
        return ["equals", "notEquals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual", "empty", "notEmpty"];
      }
      // Text, email, tel get text operators
      return ["equals", "notEquals", "contains", "empty", "notEmpty"];
    case "radio":
    case "dropdown":
    case "boolean":
      return ["equals", "notEquals"];
    case "check":
    case "multiselectdropdown":
      return ["includes", "empty", "notEmpty"];
    case "rating":
    case "slider":
    case "ranking":
      return ["equals", "notEquals", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"];
    default:
      return ["equals", "notEquals"];
  }
}

// ────────── Property accessors available for field types ──────────
function getPropertyAccessorsForFieldType(fieldType) {
  switch (fieldType) {
    case "check":
    case "multiselectdropdown":
    case "ranking":
      return ["length", "count"];
    case "text":
    case "longtext":
      return ["length"];
    default:
      return [];
  }
}

// ────────── Operator labels for display ──────────
function getOperatorLabel(op) {
  switch (op) {
    case "equals": return "= (equals)";
    case "notEquals": return "≠ (not equals)";
    case "greaterThan": return "> (greater than)";
    case "greaterThanOrEqual": return "≥ (greater than or equal)";
    case "lessThan": return "< (less than)";
    case "lessThanOrEqual": return "≤ (less than or equal)";
    case "contains": return "contains";
    case "includes": return "includes";
    case "empty": return "is empty";
    case "notEmpty": return "is not empty";
    default: return op;
  }
}

// ────────── Normalize options ──────────
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

  // keep target in sync when switching selected field/section OR when initial target changes
  React.useEffect(() => {
    setTarget(initialTarget);
  }, [initialTarget]);

  // sync UI child selection when user changes the dropdown (not on every target change)
  const handleTargetChange = React.useCallback((newTarget) => {
    setTarget(newTarget);
    if (!isSectionCtx) return;
    if (newTarget && newTarget.startsWith("child:")) {
      const cid = newTarget.slice(6);
      ui.selectedChildId.set(selectedId, cid);
    } else {
      ui.selectedChildId.set(null, null);
    }
  }, [isSectionCtx, selectedId, ui]);

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
            displayFormat: c.displayFormat,
            options: Array.isArray(c.options) ? c.options : [],
          });
        });
      } else {
        out.push({
          id: f.id,
          parentId: null,
          label: f.question?.trim() || f.title?.trim() || f.id,
          fieldType: f.fieldType,
          displayFormat: f.displayFormat,
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
        const ops = getOperatorsForFieldType(meta?.fieldType, meta?.displayFormat, meta?.inputType);
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
    <div className="logic-editor-container space-y-4">
      {/* Target picker when a section is selected */}
      {isSectionCtx && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Target Field</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none bg-white"
            value={target}
            onChange={(e) => handleTargetChange(e.target.value)}
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

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Logic Operator</label>
          <select
            value={ew.logic || "AND"}
            onChange={(e) => writeEnableWhen({ ...ew, logic: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none bg-white"
            disabled={isDisabled}
          >
            <option value="AND">AND — All conditions must be true</option>
            <option value="OR">OR — Any condition must be true</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button 
            type="button" 
            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={addCond} 
            disabled={isDisabled}
          >
            + Add Condition
          </button>
          <button 
            type="button" 
            className="px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={clear} 
            disabled={isDisabled}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Conditions list */}
      {ew.conditions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Conditions ({ew.conditions.length})</h4>
          <div className="space-y-3">
            {ew.conditions.map((c, i) => {
              const meta = findTarget(c.targetId);
              const allowedOps = getOperatorsForFieldType(meta?.fieldType, meta?.displayFormat, meta?.inputType);
              const propertyAccessors = meta ? getPropertyAccessorsForFieldType(meta.fieldType) : [];
              const hasPropertyAccessors = propertyAccessors.length > 0;
              const optList = Array.isArray(meta?.options) ? meta.options.map(normOption) : [];
              const hasOptions = optList.length > 0;
              const needsValue = !['empty', 'notEmpty'].includes(c.operator);
              
              // Numeric operators use number input for threshold comparison, not option dropdown
              const numericOperators = ['greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'];
              const isNumericComparison = numericOperators.includes(c.operator);

              return (
                <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Condition {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCond(i)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove condition"
                      disabled={isDisabled}
                    >
                      <TRASHCANTWO_ICON className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">When Field</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none bg-white text-sm"
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
                    </div>

                    {/* Property Accessor (optional - only for certain field types) */}
                    {hasPropertyAccessors && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Property (optional)</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none bg-white text-sm"
                          value={c.propertyAccessor || ''}
                          onChange={(e) => updateCond(i, { propertyAccessor: e.target.value || undefined })}
                          disabled={isDisabled || !meta}
                        >
                          <option value="">— Direct value —</option>
                          {propertyAccessors.map((prop) => (
                            <option key={prop} value={prop}>
                              .{prop} (get {prop})
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Use .length or .count to compare the number of items
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Operator</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none bg-white text-sm"
                          value={c.operator}
                          onChange={(e) => updateCond(i, { operator: e.target.value })}
                          disabled={isDisabled || !meta}
                        >
                          {(meta ? allowedOps : ["equals"]).map((op) => (
                            <option key={op} value={op}>
                              {getOperatorLabel(op)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                        {!needsValue ? (
                          <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-sm text-gray-500 flex items-center">
                            (no value needed)
                          </div>
                        ) : hasOptions && !c.propertyAccessor && !isNumericComparison ? (
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none bg-white text-sm"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none text-sm"
                            placeholder={c.propertyAccessor || isNumericComparison ? "Enter number" : "Enter value"}
                            type={c.propertyAccessor || isNumericComparison ? "number" : "text"}
                            value={c.value}
                            onChange={(e) => updateCond(i, { value: e.target.value })}
                            disabled={isDisabled || !meta}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
