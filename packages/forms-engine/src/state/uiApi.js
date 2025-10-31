import React from "react";
import { UIStoreContext } from "./uiStore";
import { useStore } from "zustand";

export const useUIApi = () => {
  const uiStore = React.useContext(UIStoreContext);
  if (!uiStore) throw new Error('Missing UIStoreContext.Provider in the tree');
  
  // ────────── Base state ──────────
  const isPreview        = useStore(uiStore, (s) => s.isPreview);
  const panelResetKey    = useStore(uiStore, (s) => s.panelResetKey);
  const selectedFieldVal = useStore(uiStore, (s) => s.selectedFieldId);
  const isEditModalOpen  = useStore(uiStore, (s) => s.isEditModalOpen);
  const conversionReport = useStore(uiStore, (s) => s.conversionReport);

  // ────────── Base actions ──────────
  const setPreview            = useStore(uiStore, (s) => s.setPreview);
  const togglePreview         = useStore(uiStore, (s) => s.togglePreview);

  const setSelectField        = useStore(uiStore, (s) => s.setSelectField);
  const clearSelectedField    = useStore(uiStore, (s) => s.clearSelectedField);
  const renameSelectedFieldId = useStore(uiStore, (s) => s.renameSelectedFieldId);

  const setEditModalOpen      = useStore(uiStore, (s) => s.setEditModalOpen);
  
  const setConversionReport   = useStore(uiStore, (s) => s.setConversionReport);
  const clearConversionReport = useStore(uiStore, (s) => s.clearConversionReport);
  
  const setHideUnsupportedFields = useStore(uiStore, (s) => s.setHideUnsupportedFields);

  // ────────── selectedChildId (reactive read) ──────────
  const selectedChild         = useStore(uiStore, (s) => s.selectedChildId); 

  // ────────── selectedChildId actions ──────────
  const setSelectedChildId          = useStore(uiStore, (s) => s.setSelectedChildId);
  const clearSelectedChildId        = useStore(uiStore, (s) => s.clearSelectedChildId);
  const renameSelectedChildParentId = useStore(uiStore, (s) => s.renameSelectedChildParentId);
  const renameSelectedChildId       = useStore(uiStore, (s) => s.renameSelectedChildId);

  // ────────── Conveniences ──────────
  const openEdit   = React.useCallback(() => setEditModalOpen(true),  [setEditModalOpen]);
  const closeEdit  = React.useCallback(() => setEditModalOpen(false), [setEditModalOpen]);
  const toggleEdit = React.useCallback(() => setEditModalOpen((v) => !v), [setEditModalOpen]);

  return React.useMemo(() => ({
    state: { isPreview, isEditModalOpen, panelResetKey },

    isPreview,

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
    
    // ────────── Conversion report ──────────
    conversionReport,
    setConversionReport,
    clearConversionReport,
    
    // ────────── Hide unsupported fields ──────────
    setHideUnsupportedFields,
  }), [
    isPreview, isEditModalOpen, panelResetKey,
    setPreview, togglePreview,
    selectedFieldVal, setSelectField, clearSelectedField, renameSelectedFieldId,
    setEditModalOpen, openEdit, closeEdit, toggleEdit,
    selectedChild, setSelectedChildId, clearSelectedChildId,
    renameSelectedChildParentId, renameSelectedChildId,
    conversionReport, setConversionReport, clearConversionReport,
    setHideUnsupportedFields,
  ]);
};
