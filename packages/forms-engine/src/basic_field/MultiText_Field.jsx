import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const MultiTextField = React.memo(function MultiTextField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className={`multitext-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light break-words overflow-hidden">{f.question || "Question"}</div>
                <div className="space-y-2">
                  {(f.options || []).map((option) => (
                    <div key={option.id} className="flex items-center border border-black/10 shadow-2xs rounded overflow-hidden">
                      <label className="px-4 py-2 text-sm text-gray-500 bg-gray-50 whitespace-nowrap border-r border-black/10">
                        {option.value}
                      </label>
                      <input
                        type="text"
                        value={option.answer || ""}
                        onChange={(e) => api.option.updateAnswer(option.id, e.target.value)}
                        placeholder=""
                        className="flex-1 min-w-0 px-4 py-2 border-0 outline-none focus:ring-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="multitext-field-edit space-y-3">
            <input
              className="px-3 py-2 h-10 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="space-y-2">
              {(f.options || []).map((option) => (
                <div key={option.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => api.option.update(option.id, e.target.value)}
                    placeholder={placeholder?.options || "Field label"}
                    className="flex-1 min-w-0 outline-none bg-transparent"
                  />
                  <button 
                    onClick={() => api.option.remove(option.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove field"
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
              <PLUSOPTION_ICON className="w-5 h-5" /> Add Field
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default MultiTextField;