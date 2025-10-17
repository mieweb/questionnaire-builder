import React from "react";
import { useFormStore } from "./formStore";
import { useUIStore } from "./uiStore";

export const useFormApi = (id, sectionId) => {
  const addField     = useFormStore((s) => s.addField);
  const updateField  = useFormStore((s) => s.updateField);
  const deleteField  = useFormStore((s) => s.deleteField);

  const addOption    = useFormStore((s) => s.addOption);
  const updateOption = useFormStore((s) => s.updateOption);
  const deleteOption = useFormStore((s) => s.deleteOption);

  const selectSingle = useFormStore((s) => s.selectSingle);
  const toggleMulti  = useFormStore((s) => s.toggleMulti);

  const onIdChange = React.useCallback((newId, oldId) => {
    const ui = useUIStore.getState();
    if (ui.selectedFieldId === oldId) ui.renameSelectedFieldId?.(newId);
    ui.renameSectionIdInHighlight?.(oldId, newId); // harmless if oldId wasn't a section
  }, []);

  return React.useMemo(
    () => ({
      field: {
        add:    (type, initialPatch, index) => addField(type, { sectionId, initialPatch, index }),
        update: (k, v) => updateField(id, { [k]: v }, { sectionId, onIdChange }),
        patch:  (patchOrFn) => updateField(id, patchOrFn, { sectionId, onIdChange }),
        renameId: (newId) => updateField(id, { id: newId }, { sectionId, onIdChange }),
        remove: () => deleteField(id, { sectionId }),
      },
      option: {
        add:    (value = "")   => addOption(id, value, { sectionId }),
        update: (optId, value) => updateOption(id, optId, value, { sectionId }),
        remove: (optId)        => deleteOption(id, optId, { sectionId }),
      },
      selection: {
        single:      (optId) => selectSingle(id, optId, { sectionId }),
        multiToggle: (optId) => toggleMulti(id, optId, { sectionId }),
      },

      section: {
        addChild: (type, initialPatch, index) =>
          addField(type, { sectionId: id, initialPatch, index }),
      },
    }),
    [
      id,
      sectionId,
      addField,
      updateField,
      deleteField,
      addOption,
      updateOption,
      deleteOption,
      selectSingle,
      toggleMulti,
      onIdChange,
    ]
  );
};
