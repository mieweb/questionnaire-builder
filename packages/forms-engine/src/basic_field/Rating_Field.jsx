import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import UnselectableRadio from "../helper_shared/UnselectableRadio";

const RatingField = React.memo(function RatingField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        const options = f.options || [];
        const selectedIndex = options.findIndex(opt => opt.id === f.selected);
        
        if (isPreview) {
          return (
            <div className={`rating-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className={`grid gap-2 pb-4 ${options.length > 5 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                <div className="font-light">{f.question || "Question"}</div>
                <div className="py-2">
                  {options.length > 0 && (
                    <div className="flex flex-wrap justify-evenly gap-2">
                      {options.map((option, index) => {
                        const inputId = `${f.id}-${option.id}`;
                        const isSelected = selectedIndex === index;
                        const labelClasses = isSelected
                          ? "flex items-center justify-center min-w-[44px] h-11 px-3 rounded-full border-2 transition-all cursor-pointer bg-blue-600 text-white border-blue-600 scale-105"
                          : "flex items-center justify-center min-w-[44px] h-11 px-3 rounded-full border-2 transition-all cursor-pointer bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:scale-105";
                        
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
          <div className="rating-field-edit space-y-3">
            <input
              className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="text-sm text-gray-600">
              Options (each will be a rating button):
            </div>

            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => api.option.update(option.id, e.target.value)}
                    placeholder={placeholder?.options || "Option label"}
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

export default RatingField;
