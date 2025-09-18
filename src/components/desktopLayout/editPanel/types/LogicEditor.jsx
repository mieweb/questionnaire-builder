import React from "react"
import { useUIStore } from "../../../../state/uiStore"
import { useFormStore } from "../../../../state/formStore"

export default function LogicEditor() {
  const selectedId = useUIStore((s) => s.selectedFieldId);
  const field = useFormStore((s) => (selectedId ? s.byId[selectedId] : null));
  const setEnableWhen = useFormStore((s) => s.setEnableWhen);

  if (!field) return null;

  const ew = field.enableWhen || { logic: "AND", conditions: [] };

  const addCond = () => {
    const next = {
      logic: ew.logic || "AND",
      conditions: [...(ew.conditions || []), { targetId: "", operator: "equals", value: "" }]
    };
    setEnableWhen(field.id, next);
  };

  const clear = () => setEnableWhen(field.id, null);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <label className="text-sm">Logic:</label>
        <select
          value={ew.logic || "AND"}
          onChange={(e) => setEnableWhen(field.id, { ...ew, logic: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <button className="px-2 py-1 border rounded" onClick={addCond}>+ Condition</button>
        <button className="px-2 py-1 border rounded" onClick={clear}>Clear</button>
      </div>

      {(ew.conditions || []).map((c, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            className="border p-1 rounded"
            placeholder="target field id"
            value={c.targetId}
            onChange={(e) => {
              const conditions = [...ew.conditions];
              conditions[i] = { ...c, targetId: e.target.value };
              setEnableWhen(field.id, { ...ew, conditions });
            }}
          />
          <select
            className="border p-1 rounded"
            value={c.operator}
            onChange={(e) => {
              const conditions = [...ew.conditions];
              conditions[i] = { ...c, operator: e.target.value };
              setEnableWhen(field.id, { ...ew, conditions });
            }}
          >
            <option value="equals">equals</option>
            <option value="contains">contains</option>
            <option value="includes">includes</option>
          </select>
          <input
            className="border p-1 rounded"
            placeholder="value"
            value={c.value}
            onChange={(e) => {
              const conditions = [...ew.conditions];
              conditions[i] = { ...c, value: e.target.value };
              setEnableWhen(field.id, { ...ew, conditions });
            }}
          />
        </div>
      ))}
    </div>
  );
}
