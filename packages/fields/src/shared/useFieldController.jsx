import React from "react";
import fieldTypes from "../fieldTypes-config.jsx";

export function useFieldController(field, sectionId, { useUIApi, useFormApi } = {}) {
  // These hooks will be passed in from the parent component
  const ui = useUIApi ? useUIApi() : { state: { isPreview: false }, selectedFieldId: { value: null, set: () => {}, clear: () => {} }, modal: { toggle: () => {} } };
  const api = useFormApi ? useFormApi(field.id, sectionId) : { field: { update: () => {}, remove: () => {} }, selection: { single: () => {} } };

  const label = fieldTypes[field.fieldType]?.label ?? "Field";
  const insideSection = !!sectionId;

  const selected = ui.selectedFieldId.value === field.id;

  const onRowClick = React.useCallback((e) => {
    if (ui.state.isPreview) return;
    e?.stopPropagation?.();
    if (ui.selectedFieldId.value === field.id) return;
    ui.selectedFieldId.set(field.id);
  }, [ui, field.id]);

  const remove = React.useCallback(() => {
    api.field.remove();
    if (selected) ui.selectedFieldId.clear();
  }, [api, selected, ui]);

  const wrapperClass = [
    "rounded-lg bg-white",
    !ui.state.isPreview ? "border" : "",
    !insideSection && ui.state.isPreview ? "border" : "",
    field.fieldType === "section" && ui.state.isPreview ? "p-0 border" : "p-4",
    selected ? "border-blue-300 border-2 border-dashed" : "border-gray-200",
  ].join(" ");

  return {
    // ────────── data ──────────
    field,
    sectionId,
    label,
    insideSection,

    // ────────── ui flags ──────────
    isPreview: ui.state.isPreview,
    selected,
    isEditModalOpen: ui.state.isEditModalOpen,

    // ────────── actions ──────────
    onRowClick,
    toggleEdit: ui.modal.toggle,
    remove,

    // ────────── data api ──────────
    api,

    // ────────── styles ──────────
    wrapperClass,
  };
}
