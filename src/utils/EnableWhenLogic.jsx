import React, { useState, useEffect, useRef } from "react"
import { X_ICON } from "../assets/icons"

//fixes inc

const DEFAULT_CONDITION = {
  fieldId: "",
  operator: "equals",
  value: ""
}

/**
 * Returns allowed operators based on the trigger field's type
 */
function getOperatorsForFieldType(fieldType) {
  switch (fieldType) {
    case "input":
      // Text input => "equals" or "contains"
      return ["equals", "contains"]
    case "radio":
      // Radio => "equals"
      return ["equals"]
    case "check":
      // Checkbox => "includes"
      return ["includes"]
    case "selection":
      // Dropdown => "equals"
      return ["equals"]
    default:
      // Fallback => possibly just "equals" or none
      return ["equals"]
  }
}

const EnableWhenLogic = ({ fieldId, formData, onUpdate }) => {
  const parentField = formData.find((f) => f.id === fieldId)
  const existing = parentField?.enableWhen || {
    logic: "AND",
    conditions: []
  }

  const [logic, setLogic] = useState(existing.logic || "AND")
  const [conditions, setConditions] = useState(existing.conditions || [])

  const prevLogic = useRef(existing.logic);
  const prevConditions = useRef(existing.conditions);

  useEffect(() => {
    if (existing.logic !== prevLogic.current || JSON.stringify(existing.conditions) !== JSON.stringify(prevConditions.current)) {
      setLogic(existing.logic);
      setConditions(existing.conditions);

      prevLogic.current = existing.logic;
      prevConditions.current = existing.conditions;
    }
  }, [existing.logic, existing.conditions]);

  const syncToParent = (newLogic, newConditions) => {
    onUpdate("enableWhen", {
      logic: newLogic,
      conditions: newConditions
    })
  }

  // - Toggle AND/OR
  const handleLogicChange = (e) => {
    const newLogic = e.target.value
    setLogic(newLogic)
    syncToParent(newLogic, conditions)
  }

  // - Add a new empty condition row
  const handleAddCondition = () => {
    const newConditions = [...conditions, { ...DEFAULT_CONDITION }]
    setConditions(newConditions)
    syncToParent(logic, newConditions)
  }

  // - Remove a condition row
  const handleRemoveCondition = (idx) => {
    const newConditions = conditions.filter((_, i) => i !== idx)
    setConditions(newConditions)
    syncToParent(logic, newConditions)
  }

  const handleConditionChange = (idx, key, val) => {
    let newConditions = conditions.map((c, i) => {
      if (i === idx) {
        const updated = { ...c, [key]: val };

        // If the user just changed the fieldId, auto-set the operator
        if (key === "fieldId") {
          const chosenField = formData.find(f => f.id === val);

          if (chosenField) {
            // Get the allowed operators based on field type
            const allowedOperators = getOperatorsForFieldType(chosenField.fieldType);

            // Set default operator to the first valid operator
            updated.operator = allowedOperators[0] || "equals";
          }
        }
        return updated;
      }
      return c;
    });

    setConditions(newConditions);
    syncToParent(logic, newConditions);
  };



  return (
    <div className="relative p-2 border border-gray-300 rounded bg-gray-50 mb-2">
      <div className="flex items-center space-x-2 mb-4">
        <label className="font-semibold">Logic:</label>
        <select
          value={logic}
          onChange={handleLogicChange}
          className="border p-1 rounded"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <button
          onClick={handleAddCondition}
          className="px-2 py-1 bg-green-200 border rounded"
        >
          + Condition
        </button>
      </div>

      {/* Render each condition row */}
      {conditions.map((cond, idx) => {
        const { fieldId: triggerFieldId, operator, value } = cond

        // 1) Identify the trigger field
        const triggerField = formData.find((f) => f.id === triggerFieldId)
        // 2) Which fieldType is it?
        const triggerFieldType = triggerField?.fieldType
        // 3) Allowed operators for that field
        const allowedOperators = getOperatorsForFieldType(triggerFieldType)

        //if field has Options --> dropdown, if its userinput --> text input
        const hasOptions = triggerField?.options?.length > 0

        return (
          <div
            key={idx}
            className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pb-2 pr-4"
          >
            <div className="w-full flex justify-end sm:justify-start sm:w-auto">
              <button
                onClick={() => handleRemoveCondition(idx)}
                className="px-2 py-1"
              >
                <X_ICON className="cursor-pointer" />
              </button>
            </div>
            {/* Field selector */}
            <select
              value={triggerFieldId}
              onChange={(e) =>
                handleConditionChange(idx, "fieldId", e.target.value)
              }
              className="border p-1 rounded w-full"
            >
              <option value="">--Select Field--</option>
              {formData
                .filter((f) => f.id !== fieldId) // exclude self
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.question || `Field ${f.id}`}
                  </option>
                ))}
            </select>

            {/* Operator selector */}
            {/* If triggerField isn't selected, we can't know the fieldType => fallback to all operators or empty */}
            <select
              value={operator}
              onChange={(e) =>
                handleConditionChange(idx, "operator", e.target.value)
              }
              className="border p-1 rounded w-full"
              disabled={!triggerFieldType}
            >
              {triggerFieldType ? (
                allowedOperators.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))
              ) : (
                <option value="">--Pick Field First--</option>
              )}
            </select>

            {/* Value input */}
            {hasOptions ? (
              // If the trigger field has options, let them pick from them
              <select
                value={value}
                onChange={(e) =>
                  handleConditionChange(idx, "value", e.target.value)
                }
                className="border p-1 rounded w-full"
                disabled={!triggerFieldType}
              >
                <option value="">--Select Option--</option>
                {triggerField.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.value}
                  </option>
                ))}
              </select>
            ) : (
              // Otherwise, let them type text
              <input
                type="text"
                className="border p-1 rounded w-full sm:w-auto"
                placeholder="Enter text value"
                value={value}
                onChange={(e) =>
                  handleConditionChange(idx, "value", e.target.value)
                }
                disabled={!triggerFieldType}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default EnableWhenLogic
