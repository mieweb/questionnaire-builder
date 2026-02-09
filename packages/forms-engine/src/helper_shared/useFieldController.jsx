import React from "react";
import fieldTypes from "./fieldTypes-config";
import { useFormApi } from "../state/formApi";
import { useUIApi } from "../state/uiApi";

export default function useFieldController(field, sectionId) {
  const ui = useUIApi();
  const api = useFormApi(field.id, sectionId);

  const label = fieldTypes[field.fieldType]?.label ?? "Field";
  const placeholder = fieldTypes[field.fieldType]?.placeholder;
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
    "mie:rounded-lg mie:bg-miesurface",
    !ui.state.isPreview ? "mie:border" : "",
    !insideSection && ui.state.isPreview ? "mie:border" : "",
    field.fieldType === "section" && ui.state.isPreview ? "mie:p-0 mie:border" : 
      (insideSection && !ui.state.isPreview ? "mie:pt-2 mie:px-6 mie:pb-6" : "mie:p-6"),
    selected ? "mie:border-mieprimary mie:border-2 mie:border-dashed" : "mie:border-mieborder",
  ].join(" ");

  return {
    // ────────── data ──────────
    field,
    sectionId,
    label,
    placeholder,
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
