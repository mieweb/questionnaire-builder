import React from "react";
import { PLUSOPTION_ICON, TRASHCANTWO_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const DropDownField = React.memo(function DropDownField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className={`dropdown-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light break-words overflow-hidden">{f.question || "Question"}</div>
                <div>
                  <select
                    className="w-full px-4 shadow border border-gray-300 rounded-lg h-10 cursor-pointer focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                    value={f.selected || ""}
                    onChange={(e) => api.selection.single(e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {(f.options || []).map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        }

        // ────────── Edit Mode ──────────
        return (
          <div className="dropdown-field-edit space-y-3">
            <input
              className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 outline-none" disabled>
                <option value="">Select an option</option>
                {(f.options || []).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {(f.options || []).map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors"
                >
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => api.option.update(option.id, e.target.value)}
                    placeholder={placeholder?.options || "Option text"}
                    className="flex-1 min-w-0 outline-none bg-transparent"
                  />
                  <button 
                    onClick={() => api.option.remove(option.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove option"
                  >
                    <TRASHCANTWO_ICON className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => api.option.add()} 
              className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <PLUSOPTION_ICON className="w-5 h-5" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default DropDownField;
