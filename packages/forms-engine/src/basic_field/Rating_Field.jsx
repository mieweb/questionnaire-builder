import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import UnselectableRadio from "../helper_shared/UnselectableRadio";

const RatingField = React.memo(function RatingField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f }) => {
        const options = f.options || [];
        const selectedIndex = options.findIndex(opt => opt.id === f.selected);
        
        if (isPreview) {
          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className={`grid gap-2 pb-4 ${options.length > 5 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                <div className="font-light">{f.question || "Question"}</div>
                <div className="py-2">
                  {options.length > 0 && (
                    <div className="flex flex-wrap justify-evenly gap-2">
                      {options.map((option, index) => {
                        const inputId = `${f.id}-${option.id}`;
                        const isSelected = selectedIndex === index;
                        const labelClasses = isSelected
                          ? "flex items-center justify-center min-w-[44px] h-11 px-3 rounded-full border-2 transition-all cursor-pointer bg-gray-900 text-white border-gray-900 scale-105"
                          : "flex items-center justify-center min-w-[44px] h-11 px-3 rounded-full border-2 transition-all cursor-pointer bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:scale-105";
                        
                        return (
                          <label
                            key={option.id}
                            htmlFor={inputId}
                            className={labelClasses}
                          >
                            <UnselectableRadio
                              id={inputId}
                              name={`rating-${f.id}`}
                              value={option.id}
                              checked={isSelected}
                              onSelect={() => api.selection.single(option.id)}
                              onUnselect={() => api.field.update("selected", null)}
                              className="hidden"
                            />
                            <span className="text-sm font-medium whitespace-nowrap">
                              {option.value}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  
                  {options.length === 0 && (
                    <div className="text-sm text-gray-400 italic">No options available</div>
                  )}
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
              placeholder="Enter question"
            />

            <div className="mt-3 text-sm text-gray-600 mb-2">
              Options (each will be a rating button):
            </div>

            {options.map((option) => (
              <div key={option.id} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => api.option.update(option.id, e.target.value)}
                  placeholder="Option label"
                  className="w-full py-2"
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

export default RatingField;
