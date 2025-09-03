import React from "react"
import { v4 as uuidv4 } from "uuid"
import fieldTypes from "../fieldTypes-config"
import { initializeField } from "../../utils/initializedFieldOptions"
import { checkFieldVisibility, checkSectionVisibility } from "../../utils/visibilityChecker"
import { EDIT_ICON, TRASHCAN_ICON, PLUSSQUARE_ICON, X_ICON } from "../../assets/icons"


const SectionField = ({ field, label, onUpdate, onDelete, isPreview, formData }) => {
  const addChild = (type) => {
    if (type === "section") return
    const template = fieldTypes[type]?.defaultProps
    if (!template) return
    const newChild = initializeField({ ...template, id: uuidv4() })
    onUpdate("fields", [...(field.fields || []), newChild])
  }

  const updateChild = (id, key, value) => {
    const updated = (field.fields || []).map((f) =>
      f.id === id ? { ...f, [key]: value } : f
    )
    onUpdate("fields", updated)
  }

  const deleteChild = (id) => {
    onUpdate("fields", (field.fields || []).filter((f) => f.id !== id))
  }

  const renderChild = (child) => {
    const Comp = fieldTypes[child.fieldType]?.component
    if (!Comp) return null
    // Pass the full formData instead of just section children for proper enableWhen evaluation
    const shouldShow = isPreview ? checkFieldVisibility(child, formData) : true
    if (!shouldShow) return null

    return (
      <div key={child.id}
        className={`${isPreview ? "" : "border"} border-gray-200 rounded-lg mb-3`}>
        <Comp
          field={child}
          label={fieldTypes[child.fieldType]?.label}
          onUpdate={(k, v) => updateChild(child.id, k, v)}
          onDelete={() => !isPreview && deleteChild(child.id)}
          isPreview={isPreview}
          formData={formData} // Pass full formData instead of just section children
          parentType="section"
        />
      </div>
    )
  }

  // Preview mode
  if (isPreview) {
    // Check if section should be visible based on enableWhen logic and child visibility
    const shouldShowSection = checkSectionVisibility(field, formData)
    if (!shouldShowSection) return null

    return (
      <section>
        <div className="bg-[#0076a8] text-white text-xl px-4 py-2 rounded-t-lg">
          {field.title || "Section"}
        </div>
        <div className="p-4 bg-white border-1 border-gray-300 rounded-b-lg">
          {(field.fields || []).map(renderChild)}
        </div>

      </section>
    )
  }

  // Edit mode 
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-md"
            value={field.title || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
            placeholder="Section title (e.g., Data Consent)"
          />
        </div>
        <button onClick={onDelete} className="ml-2 px-2 py-1 text-black/80 hover:text-red-600">
          <TRASHCAN_ICON className="cursor-pointer" />
        </button>
      </div>

      {/* Child fields */}
      <div>
        {(field.fields || []).map((child) => (
          <div key={child.id}>
            {renderChild(child)}
          </div>
        ))}
      </div>

      {/* Mini toolbar to add child fields (no nested sections) */}
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Add a field</div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(fieldTypes)
            .filter((t) => t !== "section")
            .map((t) => (
              <button
                key={t}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => addChild(t)}
              >
                <PLUSSQUARE_ICON className="h-4 w-4" />
                Add {fieldTypes[t].label}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SectionField
