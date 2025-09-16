import { create } from "zustand";

export const useUIStore = create((set, get) => ({
  // ────────── Preview/Edit mode ──────────
  isPreview: false,
  setPreview: (v) => set({ isPreview: !!v }),
  togglePreview: () => set((s) => ({ isPreview: !s.isPreview })),

  // ────────── Selected field + a key that intentionally resets EditPanel only on *selection change*. ──────────
  selectedFieldId: null,
  panelResetKey: 0,
  selectField: (id) =>
    set((s) => {
      const next = id ?? null;
      if (s.selectedFieldId === next) return {}; // ────────── no-op if same id ──────────
      return { selectedFieldId: next, panelResetKey: s.panelResetKey + 1 };
    }),

  // ────────── When renaming the selected field's id, do NOT bump the reset key ──────────
  //            (so EditPanel stays mounted while you type a new id).
  renameSelectedFieldId: (newId) => set({ selectedFieldId: newId }),

  // ────────── Edit modal (mobile) ──────────
  isEditModalOpen: false,
  setEditModalOpen: (v) =>
    set((s) => ({
      isEditModalOpen: typeof v === "function" ? !!v(s.isEditModalOpen) : !!v,
    })),

  // ────────── Section highlight map { [sectionId]: childId } ──────────
  sectionHighlight: {},
  setSectionActiveChild: (sid, cid) =>
    set((s) => ({
      sectionHighlight: { ...s.sectionHighlight, [sid]: cid ?? null },
    })),
  getSectionHighlightId: (sid) => get().sectionHighlight[sid] ?? null,

  clearSectionHighlights: () => set({ sectionHighlight: {} }),

  renameSectionIdInHighlight: (oldId, newId) =>
    set((s) => {
      if (!(oldId in s.sectionHighlight)) return {};
      const { [oldId]: val, ...rest } = s.sectionHighlight;
      return { sectionHighlight: { ...rest, [newId]: val } };
    }),
}));
