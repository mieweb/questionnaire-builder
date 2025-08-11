import React, { useState } from "react"
import { motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { ARROWDOWN_ICON, EDIT_ICON, PLUSOPTION_ICON, TRASHCAN_ICON, TRASHCANTWO_ICON } from "../../../assets/icons"
import EnableWhenLogic from "../../EnableWhenLogic"

const DropDownField = ({ field, label, onUpdate, onDelete, isPreview, formData, parentType }) => {
  const [isEdit, setIsEdit] = useState(false)
  const toggleEdit = () => setIsEdit(!isEdit)

  const addOption = () => onUpdate("options", [...field.options, { id: uuidv4(), value: "" }])
  const updateOption = (id, value) => onUpdate("options", field.options.map(o => o.id === id ? { ...o, value } : o))
  const deleteOption = (id) => onUpdate("options", field.options.filter(o => o.id !== id))
  const insideSection = parentType === "section"

  // PREVIEW MODE 
  if (isPreview) {

    return (
      <div className={`p-4 bg-white ${insideSection ? "border-0" : "border-1 border-gray-300"}`}>
        <div className="p-4 bg-white border-b-1 border-gray-300 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="font-light ">{field.question || "Question"}</div>

          <div className="relative">

            <select
              className="w-full px-4 shadow border border-black/10 rounded-lg h-10 appearance-none"
              value={field.selected || ""}
              onChange={(e) => onUpdate("selected", e.target.value)}
            >
              <option value="">Select an option</option>
              {field.options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.value}
                </option>
              ))}
            </select>

            <ARROWDOWN_ICON className="absolute top-2 bottom-0 right-2" />
          </div>

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
          <button onClick={toggleEdit}><EDIT_ICON /></button>
          <button onClick={onDelete}><TRASHCAN_ICON /></button>
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
        initial={{ height: "auto", opacity: 1 }}
        animate={{ height: isEdit ? "auto" : 0, opacity: isEdit ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className={`overflow-hidden ${!isEdit ? "pointer-events-none" : ""}`}
      >
        <EnableWhenLogic fieldId={field.id} formData={formData} onUpdate={onUpdate} />
      </motion.div>

      <div className="relative">
        <select className="w-full px-4 pr-10 mt-2 shadow border border-black/10 rounded-lg h-10 appearance-none" disabled>
          <option value="">Select an option</option>
          {field.options.map(option => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
        <ARROWDOWN_ICON className="absolute top-4 bottom-0 right-2" />
      </div>
      {field.options.map(option => (
        <div key={option.id} className="flex items-center px-3 my-1.5 shadow border border-black/10 rounded-lg h-10">
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

export default DropDownField
