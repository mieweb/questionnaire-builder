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
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light">{f.question || "Question"}</div>
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
                        className="flex-1 px-4 py-2 border-0 outline-none focus:ring-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            {(f.options || []).map((option) => (
              <div key={option.id} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => api.option.update(option.id, e.target.value)}
                  placeholder={placeholder?.options || "Field label"}
                  className="w-full py-2"
                />
                <button onClick={() => api.option.remove(option.id)}>
                  <TRASHCANTWO_ICON className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button onClick={() => api.option.add()} className="mt-2 ml-2 flex gap-3 justify-center">
              <PLUSOPTION_ICON className="h-6 w-6" /> Add Field
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default MultiTextField;