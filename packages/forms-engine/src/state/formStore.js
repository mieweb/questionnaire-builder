import React from "react";
import { createStore, useStore } from "zustand";
import fieldTypes from "../helper_shared/fieldTypes-config";
import { initializeField } from "../helper_shared/initializedField";
import { isVisible } from "../helper_shared/logicVisibility";
import { generateFieldId, generateOptionId } from "../helper_shared/idGenerator";

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
  const existingIds = new Set();
  
  (arr || []).forEach((f) => {
    let id = f.id;
    if (!id) {
      // Generate meaningful ID if missing
      const question = f.question || f.title || '';
      const fieldType = f.fieldType || 'field';
      id = generateFieldId(question, fieldType, existingIds);
    }
    existingIds.add(id);
    
    const init = initializeField({ ...f, id });
    
    // Initialize nested children in sections and generate IDs for them too
    if (init.fieldType === "section" && Array.isArray(init.fields)) {
      init.fields = init.fields.map(child => {
        let childId = child.id;
        if (!childId) {
          const childQuestion = child.question || child.title || '';
          const childFieldType = child.fieldType || 'field';
          childId = generateFieldId(childQuestion, childFieldType, existingIds);
          existingIds.add(childId);
        }
        return initializeField({ ...child, id: childId });
      });
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


export const createFormStore = (initProps = {}) => {
  const DEFAULT_PROPS = {
    byId: {},
    order: [],
    schemaType: 'mieforms-v1.0',
    schemaMetadata: {},
  };

  return createStore((set, get) => ({
    // ────────── State ──────────
    ...DEFAULT_PROPS,
    ...initProps,

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
  replaceAll: (data) => set(() => {
    // Expects form data object with schemaType and fields
    if (!data || typeof data !== 'object') {
      return { 
        ...normalize([]), 
        schemaType: 'mieforms-v1.0', 
        schemaMetadata: {} 
      };
    }
    
    const fields = data.fields || [];
    const schemaType = data.schemaType || 'mieforms-v1.0';
    
    // Extract metadata (anything that's not fields or schemaType)
    const { fields: _f, schemaType: _st, ...schemaMetadata } = data;
    
    return { ...normalize(fields), schemaType, schemaMetadata };
  }),

  // ────────── Fields (top-level or section child via options.sectionId) ──────────
  addField: (type, options = {}) =>
    set((state) => {
      const { sectionId, initialPatch = {}, index } = options;
      const tpl = fieldTypes[type]?.defaultProps;
      if (!tpl) return state;;
      
      // Collect existing IDs for collision detection
      const existingIds = new Set(Object.keys(state.byId));
      if (sectionId && state.byId[sectionId]?.fields) {
        state.byId[sectionId].fields.forEach(f => existingIds.add(f.id));
      }
      
      const question = initialPatch?.question || tpl.question || '';
      const title = initialPatch?.title || tpl.title || '';
      const text = type === 'section' ? title : question;
      const id = generateFieldId(text, type, existingIds);
      
      const f = initializeField({ ...tpl, ...initialPatch, id });

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
          if (!patch) return null;
          
          const { fieldType, id: fieldId, question, title, ...rest } = { ...prev, ...patch };
          const base = {
            fieldType,
            id: fieldId,
            ...(fieldType === "section" ? { title } : { question }),
          };
          
          return { ...base, ...rest };
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
        const existingIds = new Set(opts.map(o => o.id));
        const optionId = generateOptionId(value, existingIds, fieldId);
        const next = [...opts, { id: optionId, value }];
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
          return { id: o.id, value };
        });
        if (!changed) return null;
        return { ...f, options: next };
      });
      return res ? res : state;;
    }),

  updateOptionAnswer: (fieldId, optId, answer, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const opts = Array.isArray(f.options) ? f.options : [];
        let changed = false;
        const next = opts.map((o) => {
          if (o.id !== optId) return o;
          if (o.answer === answer) return o;
          changed = true;
          return { ...o, answer };
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

  // ────────── Rows (<field>.rows[]) for matrix fields ──────────
  addRow: (fieldId, value = "", options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const rows = Array.isArray(f.rows) ? f.rows : [];
        const existingIds = new Set(rows.map(r => r.id));
        const rowId = generateOptionId(value, existingIds, `${fieldId}-row`);
        const next = [...rows, { id: rowId, value }];
        return { ...f, rows: next };
      });
      return res ? res : state;;
    }),

  updateRow: (fieldId, rowId, value, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const rows = Array.isArray(f.rows) ? f.rows : [];
        let changed = false;
        const next = rows.map((r) => {
          if (r.id !== rowId) return r;
          if (r.value === value) return r;
          changed = true;
          return { id: r.id, value };
        });
        if (!changed) return null;
        return { ...f, rows: next };
      });
      return res ? res : state;;
    }),

  deleteRow: (fieldId, rowId, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const oldRows = Array.isArray(f.rows) ? f.rows : [];
        const rowsNext = oldRows.filter((r) => r.id !== rowId);
        if (rowsNext.length === oldRows.length) return null;
        const next = { ...f, rows: rowsNext };
        // Clean up selected object if this row had selections
        if (f.selected && typeof f.selected === 'object') {
          const rowValue = oldRows.find(r => r.id === rowId)?.value;
          if (rowValue && f.selected[rowValue] !== undefined) {
            const updatedSelected = { ...f.selected };
            delete updatedSelected[rowValue];
            next.selected = updatedSelected;
          }
        }
        return next;
      });
      return res ? res : state;;
    }),

  // ────────── Columns (<field>.columns[]) for matrix fields ──────────
  addColumn: (fieldId, value = "", options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const columns = Array.isArray(f.columns) ? f.columns : [];
        const existingIds = new Set(columns.map(c => c.id));
        const colId = generateOptionId(value, existingIds, `${fieldId}-col`);
        const next = [...columns, { id: colId, value }];
        return { ...f, columns: next };
      });
      return res ? res : state;;
    }),

  updateColumn: (fieldId, colId, value, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const columns = Array.isArray(f.columns) ? f.columns : [];
        let changed = false;
        const next = columns.map((c) => {
          if (c.id !== colId) return c;
          if (c.value === value) return c;
          changed = true;
          return { id: c.id, value };
        });
        if (!changed) return null;
        return { ...f, columns: next };
      });
      return res ? res : state;;
    }),

  deleteColumn: (fieldId, colId, options = {}) =>
    set((state) => {
      const { sectionId } = options;
      const res = updateFieldHelper(state, fieldId, sectionId, (f) => {
        const oldColumns = Array.isArray(f.columns) ? f.columns : [];
        const columnsNext = oldColumns.filter((c) => c.id !== colId);
        if (columnsNext.length === oldColumns.length) return null;
        const next = { ...f, columns: columnsNext };
        // Clean up selected object if any row had this column selected
        if (f.selected && typeof f.selected === 'object') {
          const colValue = oldColumns.find(c => c.id === colId)?.value;
          if (colValue) {
            const updatedSelected = { ...f.selected };
            let hasChanges = false;
            Object.keys(updatedSelected).forEach(rowKey => {
              // For single matrix (value is column value)
              if (updatedSelected[rowKey] === colValue) {
                delete updatedSelected[rowKey];
                hasChanges = true;
              }
              // For multi matrix (value is array of column values)
              else if (Array.isArray(updatedSelected[rowKey])) {
                const filtered = updatedSelected[rowKey].filter(v => v !== colValue);
                if (filtered.length !== updatedSelected[rowKey].length) {
                  updatedSelected[rowKey] = filtered;
                  hasChanges = true;
                }
              }
            });
            if (hasChanges) {
              next.selected = updatedSelected;
            }
          }
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
};

export const FormStoreContext = React.createContext(null);

// ────────── Selectors / Hooks ──────────
export const useFormStore = (selector) => {
  const store = React.useContext(FormStoreContext);
  if (!store) throw new Error('Missing FormStoreContext.Provider in the tree');
  return useStore(store, selector);
};

export const useField = (id) =>
  useFormStore(React.useCallback((s) => s.byId[id], [id]));

// All fields as array (use sparingly; virtualize large lists)
export const useFieldsArray = () => {
  const order = useFormStore((s) => s.order);
  const byId = useFormStore((s) => s.byId);
  return React.useMemo(() => order.map((id) => byId[id]), [order, byId]);
};

// Get complete form data with metadata for export/save
export const useFormData = () => {
  const order = useFormStore((s) => s.order);
  const byId = useFormStore((s) => s.byId);
  const schemaType = useFormStore((s) => s.schemaType);
  const schemaMetadata = useFormStore((s) => s.schemaMetadata);
  
  return React.useMemo(() => ({
    schemaType,
    ...schemaMetadata,
    fields: order.map((id) => byId[id])
  }), [order, byId, schemaType, schemaMetadata]);
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

