import React from "react";
import fieldTypes from "../fieldTypes-config";
import { useFieldApi } from "../../state/fieldApi";
import { useUIApi } from "../../state/uiApi";

export function useFieldController(field, sectionId) {
  const ui = useUIApi();
  const api = useFieldApi(field.id, sectionId);

  const label = fieldTypes[field.fieldType]?.label ?? "Field";
  const insideSection = !!sectionId;
  const selected = ui.state.selectedFieldId === field.id;

  const onRowClick = React.useCallback((e) => {
    if (ui.state.isPreview) return;
    e?.stopPropagation?.();
    if (ui.state.selectedFieldId === field.id) return; 
    ui.selection.select(field.id);
  }, [ui, field.id]);

  const remove = React.useCallback(() => {
    api.field.remove();
    if (selected) ui.selection.clear();
  }, [api, selected, ui]);

  const wrapperClass = [
    "rounded-lg bg-white",
    !ui.state.isPreview ? "border" : "",
    !insideSection && ui.state.isPreview  ? "border" : "",
    field.fieldType === "section" && ui.state.isPreview ? "p-0 border" : "p-4",
    selected ? "border-blue-300 border-2 border-dashed" : "border-gray-200",
    
  ].join(" ");

  return {
    // data
    field,
    sectionId,
    label,
    insideSection,

    // ui flags
    isPreview: ui.state.isPreview,
    selected,
    isEditModalOpen: ui.state.isEditModalOpen,

    // actions
    onRowClick,
    toggleEdit: ui.modal.toggle,
    remove,

    // data api
    api,

    // styles
    wrapperClass,
  };
}
