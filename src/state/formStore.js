import React from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import fieldTypes from "../fields/fieldTypes-config";
import { initializeField } from "../utils/initializedField";
import { useForm } from "react-hook-form";

// --- tiny helpers ---
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
};

// Normalize array of fields -> {byId, order}
const normalize = (arr) => {
  const byId = {};
  const order = [];
  (arr || []).forEach((f) => {
    const id = f.id || uuidv4();
    const init = initializeField({ ...f, id });
    byId[id] = init;
    order.push(id);
  });
  return { byId, order };
};

export const useFormStore = create((set, get) => ({
  // ────────── States  ────────── 
  byId: {},
  order: [],



  // ────────── Action: Replaces All ────────── 
  replaceAll: (fields) => set(() => normalize(fields)),

  // ────────── Fields ────────── 
  addField: (type) =>
    set((state) => {
      const tpl = fieldTypes[type]?.defaultProps;
      if (!tpl) return {};
      const id = uuidv4();
      const f = initializeField({ ...tpl, id });
      return {
        byId: { ...state.byId, [id]: f },
        order: [...state.order, id],
      };
    }),

  updateField: (id, patchOrFn) =>
    set((state) => {
      const prev = state.byId[id];
      if (!prev) return {};
      const patch = typeof patchOrFn === "function" ? patchOrFn(prev) : patchOrFn;
      if (!patch) return {};
      const next = { ...prev, ...patch };
      if (shallowEqual(next, prev)) return {};
      return { byId: { ...state.byId, [id]: next } };
    }),

  deleteField: (id) =>
    set((state) => {
      if (!state.byId[id]) return {};
      const { [id]: _, ...rest } = state.byId;
      return { byId: rest, order: state.order.filter((x) => x !== id) };
    }),

  // ────────── Section Childrens (section.fields) ────────── 
  addChildField: (sectionId, type, initialPatch = {}) =>
    set((state) => {
      const section = state.byId[sectionId];
      if (!section || !Array.isArray(section.fields)) return {};
      const tpl = fieldTypes[type]?.defaultProps;
      if (!tpl) return {};

      const child = initializeField({ ...tpl, id: uuidv4(), ...initialPatch });
      const fields = [...section.fields, child];

      return {
        byId: {
          ...state.byId,
          [sectionId]: { ...section, fields },
        },
      };
    }),

  updateChildField: (sectionId, childId, patchOrFn) =>
    set((state) => {
      const section = state.byId[sectionId];
      if (!section || !Array.isArray(section.fields)) return {};
      let changed = false;
      const newFields = section.fields.map((c) => {
        if (c.id !== childId) return c;
        const patch = typeof patchOrFn === "function" ? patchOrFn(c, section) : patchOrFn;
        const merged = { ...c, ...patch };
        if (shallowEqual(merged, c)) return c;
        changed = true;
        return merged;
      });
      if (!changed) return {};
      return {
        byId: { ...state.byId, [sectionId]: { ...section, fields: newFields } },
      };
    }),

  deleteChildField: (sectionId, childId) =>
    set((state) => {
      const section = state.byId[sectionId];
      if (!section || !Array.isArray(section.fields)) return {};
      const next = section.fields.filter((c) => c.id !== childId);
      if (next.length === section.fields.length) return {};
      return {
        byId: { ...state.byId, [sectionId]: { ...section, fields: next } },
      };
    }),

  // ────────── Options (<field>.otpions[]) ────────── 
  addOption: (fieldId) =>
    set((state) => {
      const f = state.byId[fieldId];
      if (!f) return {};
      const options = [...(f.options || []), { id: uuidv4(), value: "" }];
      return { byId: { ...state.byId, [fieldId]: { ...f, options } } };
    }),

  updateOption: (fieldId, optId, value) =>
    set((state) => {
      const f = state.byId[fieldId];
      if (!f) return {};
      let changed = false;
      const options = (f.options || []).map((o) => {
        if (o.id !== optId) return o;
        if (o.value === value) return o;
        changed = true;
        return { ...o, value };
      });
      if (!changed) return {};
      return { byId: { ...state.byId, [fieldId]: { ...f, options } } };
    }),

  deleteOption: (fieldId, optId) =>
    set((state) => {
      const f = state.byId[fieldId];
      if (!f) return {};
      const oldOpts = f.options || [];
      const options = oldOpts.filter((o) => o.id !== optId);
      if (options.length === oldOpts.length) return {};
      const next = { ...f, options };
      if (Array.isArray(f.selected)) {
        const sel = f.selected.filter((id) => id !== optId);
        if (sel.length !== f.selected.length) next.selected = sel;
      } else if (f.selected === optId) {
        next.selected = "";
      }
      return { byId: { ...state.byId, [fieldId]: next } };
    }),

  // ────────── Selection (single / Multi[]) might be unused.. ────────── 
  selectSingle: (fieldId, optId) =>
    set((state) => {
      const f = state.byId[fieldId];
      if (!f) return {};
      const nextSel = optId ?? "";
      if (f.selected === nextSel) return {};
      return { byId: { ...state.byId, [fieldId]: { ...f, selected: nextSel } } };
    }),

  toggleMulti: (fieldId, optId) =>
    set((state) => {
      const f = state.byId[fieldId];
      if (!f) return {};
      const prev = Array.isArray(f.selected) ? f.selected : [];
      const present = prev.includes(optId);
      const selected = present ? prev.filter((x) => x !== optId) : [...prev, optId];
      if (selected.length === prev.length && present) return {};
      return { byId: { ...state.byId, [fieldId]: { ...f, selected } } };
    }),
}));

// ────────── maybe handy  ────────── 

// ────────── One field by id (re-renders ONLY when this object changes) ────────── 
export const useField = (id) =>
  useFormStore(React.useCallback((s) => s.byId[id], [id]));

// ────────── All fields as array (use sparingly; virtualize large lists) ────────── 
export const useFieldsArray = () => {
  const order = useFormStore((s) => s.order);
  const byId = useFormStore((s) => s.byId);
  return React.useMemo(() => order.map((id) => byId[id]), [order, byId]);
};

// ────────── Bound API for a field (No need to memoize again on caller / Stable Return) ────────── 
export const useFieldApi = (id) => {
  const addField = useFormStore((s) => s.addField);
  const updateField = useFormStore((s) => s.updateField);
  const deleteField = useFormStore((s) => s.deleteField);

  const addOption = useFormStore((s) => s.addOption);
  const updateOption = useFormStore((s) => s.updateOption);
  const deleteOption = useFormStore((s) => s.deleteOption);

  const selectSingle = useFormStore((s) => s.selectSingle);
  const toggleMulti = useFormStore((s) => s.toggleMulti);

  const addChildField = useFormStore((s) => s.addChildField);
  const updateChildField = useFormStore((s) => s.updateChildField);
  const deleteChildField = useFormStore((s) => s.deleteChildField);
  return React.useMemo(
    () => ({
      field: {
        add: (type) => addField(type),
        update: (k, v) => updateField(id, { [k]: v }),
        remove: () => deleteField(id),
      },
      option: {
        add: () => addOption(id),
        update: (optId, v) => updateOption(id, optId, v),
        remove: (optId) => deleteOption(id, optId),
      },
      selection: {
        single: (optId) => selectSingle(id, optId),
        multiToggle: (optId) => toggleMulti(id, optId),
      },

      section: {
        addChild: (type, initialPatch) => addChildField(id, type, initialPatch),
        updateChild: (childId, patch) => updateChildField(id, childId, patch),
        removeChild: (childId) => deleteChildField(id, childId),
      },
    }),
    [
      id,
      addField, updateField, deleteField,
      addChildField, updateChildField, deleteChildField,
      addOption, updateOption, deleteOption,
      selectSingle, toggleMulti,
    ]
  );
};
