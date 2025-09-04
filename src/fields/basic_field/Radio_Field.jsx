import React, { useState } from "react"
import { motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { EDIT_ICON, PLUSOPTION_ICON, TRASHCAN_ICON, TRASHCANTWO_ICON } from "../../assets/icons"
import EnableWhenLogic from "../../utils/EnableWhenLogic"

const RadioField = ({ field, label, onUpdate, onDelete, isPreview, formData, parentType }) => {
  const [isEdit, setIsEdit] = useState(false)
  const toggleEdit = () => setIsEdit(!isEdit)

  const addOption = () => onUpdate("options", [...field.options, { id: uuidv4(), value: "" }])
  const updateOption = (id, value) => onUpdate("options", field.options.map(o => o.id === id ? { ...o, value } : o))
  const deleteOption = (id) => onUpdate("options", field.options.filter(o => o.id !== id))
  const insideSection = parentType === "section"

  // PREVIEW MODE
  if (isPreview) {
    return (
      <div className={`p-4 bg-white ${insideSection ? "border-0" : "border-1 border-gray-300 rounded-lg"}`}>
        <div className={`bg-white  ${insideSection ? "border-b-1 border-gray-300" : "border-0"} grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4`}>
          <div className="font-light">{field.question || "Question"}</div>
          <div>
            {field.options.map(option => (
              <label key={option.id} className="flex items-center px-3 py-1 my-2">
                <input
                  type="radio"
                  name={`question-${field.id}`}
                  className="mr-2 h-9 w-9 flex-shrink-0 font-light"
                  checked={field.selected === option.id}
                  onChange={() => onUpdate("selected", option.id)}
                />
                {option.value}
              </label>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // EDIT MODE
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-2 ml-1">
        {label}
        <div className="flex items-center gap-2 ml-2">
          <button onClick={toggleEdit}><EDIT_ICON className="h-6 w-6" /></button>
          <button onClick={onDelete}><TRASHCAN_ICON className="h-6 w-6" /></button>
        </div>
      </div>

      <input
        className="px-3 py-2 w-full border border-black/40 rounded"
        type="text"
        value={field.question}
        onChange={(e) => onUpdate("question", e.target.value)}
        placeholder="Enter question"
      />
      <motion.div
        initial={false}
        animate={{ height: isEdit ? "auto" : 0, opacity: isEdit ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className={`overflow-hidden ${!isEdit ? "pointer-events-none" : ""}`}
      >
        <EnableWhenLogic fieldId={field.id} formData={formData} onUpdate={onUpdate} />
      </motion.div>

      {field.options.map(option => (
        <div key={option.id} className="flex items-center px-3 my-1.5 shadow border border-black/10 rounded-lg h-10">
          <input type="radio" disabled className="mr-2" />
          <input
            type="text"
            value={option.value}
            onChange={(e) => updateOption(option.id, e.target.value)}
            placeholder="Option text"
            className="w-full"
          />
          <button onClick={() => deleteOption(option.id)}><TRASHCANTWO_ICON className="h-5 w-5" /></button>
        </div>
      ))}
      <button onClick={addOption} className="mt-2 ml-2 flex gap-3 justify-center"><PLUSOPTION_ICON className="h-6 w-6" /> Add Option</button>
    </div>
  )
}

export default RadioField
