import React from "react";
import { useUIStore } from "./uiStore";

export const useUIApi = () => {
  // state
  const isPreview       = useUIStore((s) => s.isPreview);
  const selectedFieldId = useUIStore((s) => s.selectedFieldId);
  const isEditModalOpen = useUIStore((s) => s.isEditModalOpen);

  // actions
  const setPreview            = useUIStore((s) => s.setPreview);
  const togglePreview         = useUIStore((s) => s.togglePreview);

  const selectField           = useUIStore((s) => s.selectField);
  const renameSelectedFieldId = useUIStore((s) => s.renameSelectedFieldId);

  const setEditModalOpen      = useUIStore((s) => s.setEditModalOpen);

  const getSectionHighlightId      = useUIStore((s) => s.getSectionHighlightId);
  const setSectionActiveChild      = useUIStore((s) => s.setSectionActiveChild);
  const clearSectionHighlights     = useUIStore((s) => s.clearSectionHighlights);
  const renameSectionIdInHighlight = useUIStore((s) => s.renameSectionIdInHighlight);

  // conveniences
  const openEdit   = React.useCallback(() => setEditModalOpen(true),  [setEditModalOpen]);
  const closeEdit  = React.useCallback(() => setEditModalOpen(false), [setEditModalOpen]);
  const toggleEdit = React.useCallback(() => setEditModalOpen((v) => !v), [setEditModalOpen]);
  const clearSel   = React.useCallback(() => selectField(null), [selectField]);

  return React.useMemo(() => ({
    state: { isPreview, selectedFieldId, isEditModalOpen },
    preview: { set: setPreview, toggle: togglePreview },
    selection: { select: selectField, clear: clearSel, renameSelectedFieldId },
    modal: { set: setEditModalOpen, open: openEdit, close: closeEdit, toggle: toggleEdit },
    section: {
      getHighlightId: getSectionHighlightId,
      setActiveChild: setSectionActiveChild,
      clearHighlights: clearSectionHighlights,
      renameSectionIdInHighlight,
    },
  }), [
    isPreview, selectedFieldId, isEditModalOpen,
    setPreview, togglePreview,
    selectField, clearSel, renameSelectedFieldId,
    setEditModalOpen, openEdit, closeEdit, toggleEdit,
    getSectionHighlightId, setSectionActiveChild, clearSectionHighlights, renameSectionIdInHighlight,
  ]);
};
