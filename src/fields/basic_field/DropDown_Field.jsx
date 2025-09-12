import React from "react";
import { ARROWDOWN_ICON, EDIT_ICON, PLUSOPTION_ICON, TRASHCAN_ICON, TRASHCANTWO_ICON } from "../../assets/icons";
import { useFieldApi } from "../../state/formStore";

const DropDownField = React.memo(function DropDownField({
  field,
  label,
  onDelete,
  isPreview,
  parentType,
  isEditModalOpen,
  setEditModalOpen,
  sectionId,
}) {
  const insideSection = parentType === "section";
  const api = useFieldApi(field.id, insideSection ? sectionId : undefined);
  const toggleEdit = () => setEditModalOpen?.(!isEditModalOpen);

  {/* ────────── Preview UI ──────────  */ }
  if (isPreview) {
    return (
      <div className={`p-4 bg-white ${insideSection ? "border-0" : "border-1 border-gray-300 rounded-lg"}`}>
        <div className={`bg-white ${insideSection ? "border-b-1 border-gray-300" : "border-0"} grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4`}>
          <div className="font-light">{field.question || "Question"}</div>
          <div className="relative">
            <select
              className="w-full px-4 shadow border border-black/10 rounded-lg h-10 appearance-none"
              value={field.selected || ""}
              onChange={(e) => api.selection.single(e.target.value)}
            >
              <option value="">Select an option</option>
              {(field.options || []).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.value}
                </option>
              ))}
            </select>
            <ARROWDOWN_ICON className="absolute top-2 bottom-0 right-2" />
          </div>
        </div>
      </div>
    );
  }

  {/* ────────── Edit UI ──────────  */ }
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-2 ml-1">
        {label}
        <div className="flex items-center gap-2 ml-2">
          <button onClick={toggleEdit} className={`block lg:hidden ${insideSection ? "hidden" : ""}`}><EDIT_ICON /></button>
          <button onClick={onDelete}><TRASHCAN_ICON /></button>
        </div>
      </div>

      <input
        className="px-3 py-2 w-full border border-black/40 rounded"
        type="text"
        value={field.question || ""}
        onChange={(e) => api.field.update("question", e.target.value)}
        placeholder="Enter question"
      />

      <div className="relative">
        <select className="w-full px-4 pr-10 mt-2 shadow border border-black/10 rounded-lg h-10 appearance-none" disabled>
          <option value="">Select an option</option>
          {(field.options || []).map((option) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
        <ARROWDOWN_ICON className="absolute top-4 bottom-0 right-2" />
      </div>

      {(field.options || []).map((option) => (
        <div key={option.id} className="flex items-center px-3 my-1.5 shadow border border-black/10 rounded-lg h-10">
          <input
            type="text"
            value={option.value}
            onChange={(e) => api.option.update(option.id, e.target.value)}
            placeholder="Option text"
            className="w-full"
          />
          <button onClick={() => api.option.remove(option.id)}>
            <TRASHCANTWO_ICON className="h-5 w-5" />
          </button>
        </div>
      ))}

      <button onClick={() => api.option.add()} className="mt-2 ml-2 flex gap-3 justify-center">
        <PLUSOPTION_ICON className="h-6 w-6" /> Add Option
      </button>
    </div>
  );
});

export default DropDownField;
