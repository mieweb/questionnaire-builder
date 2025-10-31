import React from "react";
import { createStore, useStore } from "zustand";

export const createUIStore = (initProps = {}) => {
  const DEFAULT_PROPS = {
    isPreview: false,
    isEditModalOpen: false,
    panelResetKey: 0,
    selectedFieldId: null,
    selectedChildId: { parentId: null, childId: null },
    conversionReport: null,
    hideUnsupportedFields: false,
  };

  return createStore((set, get) => ({
    // ────────── State ──────────
    ...DEFAULT_PROPS,
    ...initProps,
  // ────────── Preview/Edit mode ──────────
  isPreview: false,
  setPreview: (v) => set({ isPreview: !!v }),
  togglePreview: () => set((s) => ({ isPreview: !s.isPreview })),

  // ────────── Edit modal (mobile) ──────────
  isEditModalOpen: false,
  setEditModalOpen: (v) =>
    set((s) => ({
      isEditModalOpen: typeof v === "function" ? !!v(s.isEditModalOpen) : !!v,
    })),

  // ────────── Selected field {activeId}──────────
  panelResetKey: 0,

  selectedFieldId: null,

  setSelectField: (id) =>
    set((s) => {
      const next = id ?? null;
      if (s.selectedFieldId === next) return {};
      return { selectedFieldId: next, panelResetKey: s.panelResetKey + 1 };
    }),

  clearSelectedField: () =>
    set({ selectedFieldId: null }),

  renameSelectedFieldId: (newId) => set({ selectedFieldId: newId }),

  // ────────── selectedChildId: single pair { parentId, childId } ──────────
  selectedChildId: { parentId: null, childId: null },

  setSelectedChildId: (parentId, childId) =>
    set((s) => {
      const p = parentId ?? null;
      const c = childId ?? null;
      // ────────── No-op if nothing changed ──────────
      if (s.selectedChildId.parentId === p && s.selectedChildId.childId === c) return {};
      return { selectedChildId: { parentId: p, childId: c } };
    }),

  clearSelectedChildId: () =>
    set((s) => {
      // ────────── No-op if already cleared ──────────
      if (s.selectedChildId.parentId === null && s.selectedChildId.childId === null) return {};
      return { selectedChildId: { parentId: null, childId: null } };
    }),

  renameSelectedChildParentId: (newId) =>
    set((s) => ({
      selectedChildId: { ...s.selectedChildId, parentId: newId ?? null },
    })),

  renameSelectedChildId: (newId) =>
    set((s) => ({
      selectedChildId: { ...s.selectedChildId, childId: newId ?? null },
    })),

  // ────────── Conversion report (SurveyJS, etc.) ──────────
  conversionReport: null,
  
  setConversionReport: (report) => set({ conversionReport: report }),
  
  clearConversionReport: () => set({ conversionReport: null }),

  // ────────── Hide unsupported fields ──────────
  hideUnsupportedFields: false,
  
  setHideUnsupportedFields: (v) => set({ hideUnsupportedFields: !!v }),

}));
};

export const UIStoreContext = React.createContext(null);

export const useUIStore = (selector) => {
  const store = React.useContext(UIStoreContext);
  if (!store) throw new Error('Missing UIStoreContext.Provider in the tree');
  return useStore(store, selector);
};
