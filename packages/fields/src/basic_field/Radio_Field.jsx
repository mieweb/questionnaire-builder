import React from "react";
import FieldWrapper from "../shared/FieldWrapper.jsx";
import { useFieldController } from "../shared/useFieldController.jsx";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "@questionnaire-builder/icons";

const RadioField = React.memo(function RadioField({ field, sectionId, hooks }) {
  const ctrl = useFieldController(field, sectionId, hooks);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f }) => {
        if (isPreview) {
          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light">
                  {f.question || "Question"}
                  {f.required && <span className="text-red-500 ml-1">*</span>}
                </div>
                <div>
                  {(f.options || []).map((option) => (
                    <label key={option.id} className="flex items-center px-3 py-1 my-2">
                      <input
                        type="radio"
                        name={`question-${f.id}`}
                        className="mr-2 h-9 w-9 flex-shrink-0"
                        checked={f.selected === option.id}
                        onChange={() => api.selection.single(option.id)}
                        required={f.required}
                      />
                      {option.value}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // ────────── Edit Mode ──────────
        return (
          <div>
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder="Enter question"
            />

            {(f.options || []).map((option) => (
              <div key={option.id} className="flex items-center px-3 my-1.5 shadow border border-black/10 rounded-lg h-10">
                <input type="radio" disabled className="mr-2" />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => api.option.update(option.id, e.target.value)}
                  placeholder="Option text"
                  className="w-full"
                />
                <button onClick={() => api.option.remove(option.id)}>
                  <TRASHCANTWO_ICON className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button onClick={() => api.option.add()} className="mt-2 ml-2 flex gap-3 justify-center">
              <PLUSOPTION_ICON className="h-6 w-6" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default RadioField;
