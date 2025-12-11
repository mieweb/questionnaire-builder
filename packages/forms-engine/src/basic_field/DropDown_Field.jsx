import React from "react";
import { PLUSOPTION_ICON, TRASHCANTWO_ICON } from "../helper_shared/icons";
import CustomDropdown from "../helper_shared/CustomDropdown";
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
                <CustomDropdown
                  options={f.options || []}
                  value={f.selected || null}
                  onChange={(selectedId) => api.selection.single(selectedId)}
                  placeholder="Select an option"
                  showClearOption={true}
                />
              </div>
            </div>
          );
        }

        // ────────── Edit Mode ──────────
        return (
          <div className="dropdown-field-edit space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                value={f.question || ""}
                onChange={(e) => api.field.update("question", e.target.value)}
                placeholder={placeholder?.question || "Enter question"}
                className="px-3 py-2 h-10 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
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
                      <TRASHCANTWO_ICON className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
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
