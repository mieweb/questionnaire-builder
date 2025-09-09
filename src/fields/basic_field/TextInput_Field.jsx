import React from "react";
import { EDIT_ICON, TRASHCAN_ICON } from "../../assets/icons";
import { useFieldApi } from "../../state/formStore";

const TextInputField = React.memo(function TextInputField({
  field,
  label,
  onDelete,
  isPreview,
  parentType,
  isEditModalOpen,
  setEditModalOpen,
}) {
  const api = useFieldApi(field.id);
  const insideSection = parentType === "section";
  const toggleEdit = () => setEditModalOpen?.(!isEditModalOpen);

  {/* ────────── Preview UI ──────────  */}
  if (isPreview) {
    return (
      <div className={`p-4 bg-white ${insideSection ? "border-0" : "border-1 border-gray-300 rounded-lg"}`}>
        <div className={`bg-white ${insideSection ? "border-b-1 border-gray-300" : "border-0"} grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4`}>
          <div className="font-light">{field.question || "Question"}</div>
          <input
            type="text"
            value={field.answer || ""}
            onChange={(e) => api.field.update("answer", e.target.value)}
            placeholder="Type your answer"
            className="px-3 py-2 w-full border border-black/10 shadow-2xs rounded h-9"
          />
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
          <button onClick={toggleEdit} className={`block lg:hidden ${insideSection ? "hidden" : ""}`}>
            <EDIT_ICON className="h-6 w-6" />
          </button>
          <button onClick={onDelete}>
            <TRASHCAN_ICON className="h-6 w-6" />
          </button>
        </div>
      </div>

      <input
        className="px-3 py-2 w-full border border-black/40 rounded"
        type="text"
        value={field.question || ""}
        onChange={(e) => api.field.update("question", e.target.value)}
        placeholder="Enter question"
      />

      <input
        type="text"
        value={field.answer || ""}
        placeholder="Type your answer"
        className="px-3 my-1.5 w-full border border-black/10 shadow-2xs rounded h-10"
        disabled
      />
    </div>
  );
});

export default TextInputField;
