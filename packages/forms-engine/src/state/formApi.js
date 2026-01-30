import React from "react";
import { FormStoreContext } from "./formStore";
import { UIStoreContext } from "./uiStore";
import { useStore } from "zustand";

export const useFormApi = (id, sectionId) => {
  const formStore = React.useContext(FormStoreContext);
  const uiStore = React.useContext(UIStoreContext);
  
  if (!formStore) throw new Error('Missing FormStoreContext.Provider in the tree');
  if (!uiStore) throw new Error('Missing UIStoreContext.Provider in the tree');
  
  const addField     = useStore(formStore, (s) => s.addField);
  const updateField  = useStore(formStore, (s) => s.updateField);
  const deleteField  = useStore(formStore, (s) => s.deleteField);

  const addOption       = useStore(formStore, (s) => s.addOption);
  const updateOption    = useStore(formStore, (s) => s.updateOption);
  const updateOptionAnswer = useStore(formStore, (s) => s.updateOptionAnswer);
  const deleteOption    = useStore(formStore, (s) => s.deleteOption);

  const addRow       = useStore(formStore, (s) => s.addRow);
  const updateRow    = useStore(formStore, (s) => s.updateRow);
  const deleteRow    = useStore(formStore, (s) => s.deleteRow);

  const addColumn    = useStore(formStore, (s) => s.addColumn);
  const updateColumn = useStore(formStore, (s) => s.updateColumn);
  const deleteColumn = useStore(formStore, (s) => s.deleteColumn);

  const selectSingle = useStore(formStore, (s) => s.selectSingle);
  const toggleMulti  = useStore(formStore, (s) => s.toggleMulti);

  const onIdChange = React.useCallback((newId, oldId) => {
    const ui = uiStore.getState();
    if (ui.selectedFieldId === oldId) ui.renameSelectedFieldId?.(newId);
    ui.renameSectionIdInHighlight?.(oldId, newId);
  }, [uiStore]);

  return React.useMemo(
    () => ({
      field: {
        add:    (type, initialPatch, index) => addField(type, { sectionId, initialPatch, index }),
        update: (k, v) => updateField(id, { [k]: v }, { sectionId, onIdChange }),
        patch:  (patchOrFn) => updateField(id, patchOrFn, { sectionId, onIdChange }),
        drop: (...keys) => updateField(id, (prev) => {
          const next = { ...prev };
          keys.forEach(k => delete next[k]);
          return next;
        }, { sectionId, onIdChange }),
        renameId: (newId) => updateField(id, { id: newId }, { sectionId, onIdChange }),
        remove: () => deleteField(id, { sectionId }),
      },
      option: {
        add:          (value = "")   => addOption(id, value, { sectionId }),
        update:       (optId, value) => updateOption(id, optId, value, { sectionId }),
        updateAnswer: (optId, answer) => updateOptionAnswer(id, optId, answer, { sectionId }),
        remove:       (optId)        => deleteOption(id, optId, { sectionId }),
      },
      row: {
        add:    (value = "")   => addRow(id, value, { sectionId }),
        update: (rowId, value) => updateRow(id, rowId, value, { sectionId }),
        remove: (rowId)        => deleteRow(id, rowId, { sectionId }),
      },
      column: {
        add:    (value = "")   => addColumn(id, value, { sectionId }),
        update: (colId, value) => updateColumn(id, colId, value, { sectionId }),
        remove: (colId)        => deleteColumn(id, colId, { sectionId }),
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
      updateOptionAnswer,
      deleteOption,
      addRow,
      updateRow,
      deleteRow,
      addColumn,
      updateColumn,
      deleteColumn,
      selectSingle,
      toggleMulti,
      onIdChange,
    ]
  );
};
