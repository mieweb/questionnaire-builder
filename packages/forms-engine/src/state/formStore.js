import React from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import fieldTypes from "../helper_shared/fieldTypes-config";
import { initializeField } from "../helper_shared/initializedField";
import { isVisible } from "../helper_shared/logicVisibility";

// ────────── Helpers ──────────
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
};

const insertAt = (arr, item, index) => {
  if (typeof index !== "number" || index < 0 || index > arr.length) return [...arr, item];
  return [...arr.slice(0, index), item, ...arr.slice(index)];
};

const normalize = (arr) => {
  const byId = {};
  const order = [];
  (arr || []).forEach((f) => {
    const id = f.id || uuidv4();
    const init = initializeField({ ...f, id });
    
    // Initialize nested children in sections (but don't add them to byId separately)
    if (init.fieldType === "section" && Array.isArray(init.fields)) {
      init.fields = init.fields.map(child => initializeField(child));
    }
    
    byId[id] = init;
    order.push(id);
  });
  return { byId, order };
};

function updateFieldHelper(state, id, sectionId, makeNext, opts = {}) {
  const { onIdChange, forbidCollision = true } = opts;

  // ────────── Top-level ──────────
  if (!sectionId) {
    const prev = state.byId[id];
    if (!prev) return null;
    const next = makeNext(prev, null);
    if (!next || shallowEqual(prev, next)) return null;

    if (next.id && next.id !== id) {
      const newId = next.id;
      if (forbidCollision && state.byId[newId]) return null;
      const { [id]: _omit, ...rest } = state.byId;
      const byId = { ...rest, [newId]: next };
      const order = state.order.map((x) => (x === id ? newId : x));
      onIdChange?.(newId, id);
      return { byId, order };
    }
    return { byId: { ...state.byId, [id]: next } };
  }

  // ────────── Child inside a section ──────────
  const section = state.byId[sectionId];
  if (!section || !Array.isArray(section.fields)) return null;

  let changed = false;
  let renamedTo = null;

  const newFields = section.fields.map((c) => {
    if (c.id !== id) return c;
    const next = makeNext(c, section);
    if (!next || shallowEqual(c, next)) return c;
    if (next.id && next.id !== id) {
      if (forbidCollision && section.fields.some((f) => f.id === next.id && f !== c)) {
        return c;
      }
      renamedTo = next.id;
    }
    changed = true;
    return next;
  });

  if (!changed) return null;

  const byId = { ...state.byId, [sectionId]: { ...section, fields: newFields } };
  if (renamedTo) onIdChange?.(renamedTo, id);
  return { byId };
}


export const useFormStore = create((set, get) => ({
  // ────────── State ──────────
  byId: {},
  order: [],

  // ────────── Minimal init API ──────────
  setEnableWhen: (id, enableWhen) =>
    set((s) => {
      const f = s.byId[id];
      if (!f) return s;
      const ew = enableWhen && Array.isArray(enableWhen.conditions)
        ? { logic: enableWhen.logic || "AND", conditions: enableWhen.conditions }
        : undefined; // undefined => remove key (no logic)
      return { byId: { ...s.byId, [id]: { ...f, ...(ew ? { enableWhen: ew } : { enableWhen: undefined }) } } };
    }),

  // ────────── Action: Replaces All ──────────
  replaceAll: (fields) => set(() => normalize(fields)),

  // ────────── Fields (top-level or section child via options.sectionId) ──────────
  addField: (type, options = {}) =>
    set((state) => {
      const { sectionId, initialPatch = {}, index } = options;
      const tpl = fieldTypes[type]?.defaultProps;
      if (!tpl) return state;;
      const id = uuidv4();
      const f = initializeField({ ...tpl, id, ...initialPatch });

      if (!sectionId) {
        return {
          byId: { ...state.byId, [id]: f },
          order: insertAt(state.order, id, index),
        };
      }

      const section = state.byId[sectionId];
      if (!section || !Array.isArray(section.fields)) return state;;
      const fields = insertAt(section.fields, f, index);
      return { byId: { ...state.byId, [sectionId]: { ...section, fields } } };
    }),

  updateField: (id, patchOrFn, options = {}) =>
    set((state) => {
      const { sectionId, onIdChange } = options;
      const res = updateFieldHelper(
        state,
        id,
        sectionId,
        (prev) => {
          const patch = typeof patchOrFn === "function" ? patchOrFn(prev) : patchOrFn;
          return patch ? { ...prev, ...patch } : null;
        },
        { onIdChange, forbidCollision: true }
      );
      return res ? res : state;
    }),


  deleteField: (id, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      if (!sectionId) {
        if (!state.byId[id]) return state;;
        const { [id]: _omit, ...rest } = state.byId;
        return { byId: rest, order: state.order.filter((x) => x !== id) };
      }
      const section = state.byId[sectionId];
      if (!section || !Array.isArray(section.fields)) return state;;
      const next = section.fields.filter((c) => c.id !== id);
      if (next.length === section.fields.length) return state;;
      return { byId: { ...state.byId, [sectionId]: { ...section, fields: next } } };
    }),

  // ────────── Options (<field>.options[]) ──────────
  addOption: (fieldId, value = "", options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const opts = Array.isArray(f.options) ? f.options : [];
        const next = [...opts, { id: uuidv4(), value }];
        return { ...f, options: next };
      });
      return res ? res : state;;
    }),

  updateOption: (fieldId, optId, value, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const opts = Array.isArray(f.options) ? f.options : [];
        let changed = false;
        const next = opts.map((o) => {
          if (o.id !== optId) return o;
          if (o.value === value) return o;
          changed = true;
          return { ...o, value };
        });
        if (!changed) return null;
        return { ...f, options: next };
      });
      return res ? res : state;;
    }),

  deleteOption: (fieldId, optId, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const oldOpts = Array.isArray(f.options) ? f.options : [];
        const optionsNext = oldOpts.filter((o) => o.id !== optId);
        if (optionsNext.length === oldOpts.length) return null;
        const next = { ...f, options: optionsNext };
        if (Array.isArray(f.selected)) {
          const sel = f.selected.filter((id) => id !== optId);
          if (sel.length !== f.selected.length) next.selected = sel;
        } else if (f.selected === optId) {
          next.selected = "";
        }
        return next;
      });
      return res ? res : state;;
    }),

  // ────────── Selection (single / Multi[]) ──────────
  selectSingle: (fieldId, optId, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const nextSel = optId ?? "";
        if (f.selected === nextSel) return null;
        return { ...f, selected: nextSel };
      });
      return res ? res : state;;
    }),

  toggleMulti: (fieldId, optId, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const prev = Array.isArray(f.selected) ? f.selected : [];
        const present = prev.includes(optId);
        const selected = present ? prev.filter((x) => x !== optId) : [...prev, optId];
        if (selected.length === prev.length && present) return null;
        return { ...f, selected };
      });
      return res ? res : state;;
    }),
}));

// ────────── Selectors / Hooks ──────────

export const useField = (id) =>
  useFormStore(React.useCallback((s) => s.byId[id], [id]));

// All fields as array (use sparingly; virtualize large lists)
export const useFieldsArray = () => {
  const order = useFormStore((s) => s.order);
  const byId = useFormStore((s) => s.byId);
  return React.useMemo(() => order.map((id) => byId[id]), [order, byId]);
};

export const useVisibleFields = (isPreview) => {
  const order = useFormStore((s) => s.order);
  const byId = useFormStore((s) => s.byId);
  
  return React.useMemo(() => {
    const fields = order.map(id => byId[id]);
    
    // Build flat array (sections + their children)
    const allFlat = [];
    fields.forEach(f => {
      allFlat.push(f);
      if (f?.fieldType === "section" && Array.isArray(f.fields)) {
        allFlat.push(...f.fields);
      }
    });

    // Filter by visibility if in preview
    if (!isPreview) return { fields, allFlat };
    const visible = fields.filter(f => isVisible(f, allFlat));
    return { fields: visible, allFlat };
  }, [order, byId, isPreview]);
};

