import React, { useState } from "react"
import { motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { EDIT_ICON, TRASHCAN_ICON } from "../../../assets/icons"
import EnableWhenLogic from "../../EnableWhenLogic"

const TextInputField = ({ field, label, onUpdate, onDelete, isPreview, formData, parentType }) => {
  const [isEdit, setIsEdit] = useState(false)
  const toggleEdit = () => setIsEdit(!isEdit)
  const uniqueId = field.id || uuidv4()
  const insideSection = parentType === "section"

  // PREVIEW MODE
  if (isPreview) {
    return (
      <div className={`p-4 bg-white ${insideSection ? "border-0" : "border-1 border-gray-300"}`}>
        <div className="p-4 bg-white border-b-1 border-gray-300 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="font-light">{field.question || "Question"}</div>
          <input
            id={`answer-uuid-${uniqueId}`}
            type="text"
            value={field.answer || ""}
            onChange={(e) => onUpdate("answer", e.target.value)}
            placeholder="Type your answer"
            className="px-3 py-2 w-full border border-black/10 shadow-2xs rounded h-9"
          />
        </div>
      </div>
    )
  }

  // EDIT MODE 
  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between mb-2">
        {label}
        <div className="flex items-center gap-2 ml-2">
          <button onClick={toggleEdit}><EDIT_ICON className="h-6 w-6"/></button>
          <button onClick={onDelete}><TRASHCAN_ICON className="h-6 w-6" /></button>
        </div>
      </div>

      <input
        className="px-3 py-2 w-full border border-black/40 rounded"
        id={`input-uuid-${uniqueId}`}
        type="text"
        value={field.question}
        onChange={(e) => onUpdate("question", e.target.value)}
        placeholder="Enter question"
      />
      <motion.div
        initial={{ height: "auto", opacity: 1 }}
        animate={{ height: isEdit ? "auto" : 0, opacity: isEdit ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className={`overflow-hidden ${!isEdit ? "pointer-events-none" : ""}`}
      >
        <EnableWhenLogic fieldId={field.id} formData={formData} onUpdate={onUpdate} />
      </motion.div>
      <input
        type="text"
        value={field.answer || ""}
        placeholder="Type your answer"
        className="px-3 my-1.5 w-full border border-black/10 shadow-2xs rounded h-10"
        disabled
      />
    </div>
  )
}

export default TextInputField
