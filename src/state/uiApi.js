import React from "react";
import { useUIStore } from "./uiStore";

export const useUIApi = () => {
  // ────────── Base state ──────────
  const isPreview        = useUIStore((s) => s.isPreview);
  const selectedFieldVal = useUIStore((s) => s.selectedFieldId);
  const isEditModalOpen  = useUIStore((s) => s.isEditModalOpen);

  // ────────── Base actions ──────────
  const setPreview            = useUIStore((s) => s.setPreview);
  const togglePreview         = useUIStore((s) => s.togglePreview);

  const setSelectField        = useUIStore((s) => s.setSelectField);
  const clearSelectedField    = useUIStore((s) => s.clearSelectedField);
  const renameSelectedFieldId = useUIStore((s) => s.renameSelectedFieldId);

  const setEditModalOpen      = useUIStore((s) => s.setEditModalOpen);

  // ────────── selectedChildId (reactive read) ──────────
  const selectedChild         = useUIStore((s) => s.selectedChildId); 

  // ────────── selectedChildId actions ──────────
  const setSelectedChildId          = useUIStore((s) => s.setSelectedChildId);
  const clearSelectedChildId        = useUIStore((s) => s.clearSelectedChildId);
  const renameSelectedChildParentId = useUIStore((s) => s.renameSelectedChildParentId);
  const renameSelectedChildId       = useUIStore((s) => s.renameSelectedChildId);

  // ────────── Conveniences ──────────
  const openEdit   = React.useCallback(() => setEditModalOpen(true),  [setEditModalOpen]);
  const closeEdit  = React.useCallback(() => setEditModalOpen(false), [setEditModalOpen]);
  const toggleEdit = React.useCallback(() => setEditModalOpen((v) => !v), [setEditModalOpen]);

  return React.useMemo(() => ({
    state: { isPreview, isEditModalOpen },

    preview: { set: setPreview, toggle: togglePreview },
    
    modal: { set: setEditModalOpen, open: openEdit, close: closeEdit, toggle: toggleEdit },

    // ────────── selectedFieldId ──────────
    selectedFieldId: {
      value: selectedFieldVal,
      set:   setSelectField,
      clear: clearSelectedField,
      rename: renameSelectedFieldId,
    },

    // ────────── selectedChildId ──────────
    selectedChildId: {
      ChildId:  selectedChild?.childId ?? null,
      ParentId: selectedChild?.parentId ?? null,
      BothId:   selectedChild || { parentId: null, childId: null },
      set: setSelectedChildId,                    
      clear: clearSelectedChildId,
      renameParentId: renameSelectedChildParentId,
      renameChildId:  renameSelectedChildId,
    },
  }), [
    isPreview, isEditModalOpen,
    setPreview, togglePreview,
    selectedFieldVal, setSelectField, clearSelectedField, renameSelectedFieldId,
    setEditModalOpen, openEdit, closeEdit, toggleEdit,
    selectedChild, setSelectedChildId, clearSelectedChildId,
    renameSelectedChildParentId, renameSelectedChildId,
  ]);
};
