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
            <div className={`rating-field-preview ${insideSection ? "mie:border-b mie:border-gray-200" : "mie:border-0"}`}>
              <div className={`mie:grid mie:gap-2 mie:pb-4 ${options.length > 5 ? 'mie:grid-cols-1' : 'mie:grid-cols-1 mie:lg:grid-cols-2'}`}>
                <div className="mie:font-light mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <div className="mie:py-2">
                  {options.length > 0 && (
                    <div className="mie:flex mie:flex-wrap mie:justify-evenly mie:gap-2">
                      {options.map((option, index) => {
                        const inputId = `${f.id}-${option.id}`;
                        const isSelected = selectedIndex === index;
                        const labelClasses = isSelected
                          ? "mie:flex mie:items-center mie:justify-center mie:min-w-[44px] mie:h-11 mie:px-3 mie:rounded-full mie:border-2 mie:transition-all mie:cursor-pointer mie:bg-blue-600 mie:text-white mie:border-blue-600 mie:scale-105"
                          : "mie:flex mie:items-center mie:justify-center mie:min-w-[44px] mie:h-11 mie:px-3 mie:rounded-full mie:border-2 mie:transition-all mie:cursor-pointer mie:bg-white mie:text-gray-700 mie:border-gray-300 mie:hover:border-blue-300 mie:hover:bg-blue-50 mie:hover:scale-105";
                        
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
                              className="mie:hidden"
                            />
                            <span className="mie:text-sm mie:font-medium mie:whitespace-nowrap">
                              {option.text || option.value}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  
                  {options.length === 0 && (
                    <div className="mie:text-sm mie:text-gray-400 mie:italic">No options available</div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="rating-field-edit mie:space-y-3">
            <input
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-gray-300 mie:rounded-lg mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="mie:text-sm mie:text-gray-600">
              Options (each will be a rating button):
            </div>

            <div className="mie:space-y-2">
              {options.map((option) => (
                <div key={option.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-gray-300 mie:rounded-lg mie:shadow-sm mie:hover:border-gray-400 mie:transition-colors">
                  <div className="mie:w-3 mie:h-3 mie:rounded-full mie:bg-blue-400 mie:shrink-0" />
                  <input
                    type="text"
                    value={option.text || option.value}
                    onChange={(e) => api.option.update(option.id, { text: e.target.value, value: typeof option.value === 'number' ? option.value : e.target.value })}
                    placeholder={placeholder?.options || "Option label"}
                    className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent"
                  />
                  <button 
                    onClick={() => api.option.remove(option.id)}
                    className="mie:shrink-0 mie:text-gray-400 mie:hover:text-red-600 mie:transition-colors"
                    title="Remove option"
                  >
                    <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => api.option.add()} 
              className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:text-blue-600 mie:border mie:border-blue-300 mie:rounded-lg mie:hover:bg-blue-50 mie:transition-colors mie:flex mie:items-center mie:justify-center mie:gap-2"
            >
              <PLUSOPTION_ICON className="mie:w-5 mie:h-5" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default RatingField;
