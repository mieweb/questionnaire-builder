import React from "react";
import { PLUSOPTION_ICON, TRASHCANTWO_ICON } from "../../assets/icons";
import FieldWrapper from "../shared/FieldWrapper"
import { useFieldController } from "../shared/useFieldController";

const CheckField = React.memo(function CheckField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f }) => {
        if (isPreview) {
          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light">{f.question || "Question"}</div>
                <div>
                  {(f.options || []).map((option) => (
                    <label key={option.id} className="flex items-center px-3 py-1 my-2">
                      <input
                        type="checkbox"
                        className="mr-2 w-9 h-9"
                        checked={Array.isArray(f.selected) && f.selected.includes(option.id)}
                        onChange={() => api.selection.multiToggle(option.id)}
                      />
                      {option.value}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <>
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder="Enter question"
            />

            {(f.options || []).map((option) => (
              <div key={option.id} className="flex items-center px-3 shadow my-1.5 border border-black/10 rounded-lg h-10">
                <input type="checkbox" disabled className="mr-2" />
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
          </>
        );
      }}
    </FieldWrapper>
  );
});

export default CheckField;
