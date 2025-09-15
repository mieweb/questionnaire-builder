import React from "react";
import { EDIT_ICON, PLUSOPTION_ICON, TRASHCAN_ICON, TRASHCANTWO_ICON } from "../../assets/icons";
import { useFieldApi } from "../../state/fieldAPI";

const CheckField = React.memo(function CheckField({
  field,
  label,
  onDelete,
  isPreview,
  isEditModalOpen,
  setEditModalOpen,
  parentType,
  sectionId, 
}) {
  // If rendered inside a section, bind to that section via sectionId
  const api = useFieldApi(field.id, parentType === "section" ? sectionId : undefined);
  const insideSection = parentType === "section";
  const toggleEdit = () => setEditModalOpen?.(!isEditModalOpen);

  {/* ────────── Preview UI ──────────  */}
  if (isPreview) {
    return (
      <div className={`p-4 bg-white ${insideSection ? "border-0" : "border-1 border-gray-300"}`}>
        <div className={`bg-white ${insideSection ? "border-b-1 border-gray-300" : "border-0"} grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4`}>
          <div className="font-light">{field.question || "Question"}</div>
          <div>
            {(field.options || []).map(option => (
              <label key={option.id} className="flex items-center px-3 py-1 my-2">
                <input
                  type="checkbox"
                  className="mr-2 w-9 h-9"
                  checked={Array.isArray(field.selected) && field.selected.includes(option.id)}
                  onChange={() => api.selection.multiToggle(option.id)}
                />
                {option.value}
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  {/* ────────── Edit UI ──────────  */}
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

      {(field.options || []).map(option => (
        <div key={option.id} className="flex items-center px-3 shadow my-1.5 border border-black/10 rounded-lg h-10">
          <input type="checkbox" disabled className="mr-2" />
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

export default CheckField;
