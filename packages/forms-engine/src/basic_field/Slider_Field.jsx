import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const SliderField = React.memo(function SliderField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        const options = f.options || [];
        const selectedIndex = options.findIndex(opt => opt.id === f.selected);
        
        if (isPreview) {
          return (
            <div className={`slider-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className={`grid gap-2 pb-4 ${options.length > 5 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                <div className="font-light">{f.question || "Question"}</div>
                <div className="py-2">
                  {options.length > 0 && (
                    <div className="relative pt-1">
                      {/* Slider Track */}
                      <input
                        type="range"
                        min="0"
                        max={options.length - 1}
                        step="1"
                        value={selectedIndex >= 0 ? selectedIndex : 0}
                        onChange={(e) => {
                          const index = parseInt(e.target.value);
                          api.selection.single(options[index]?.id);
                        }}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                      />
                      
                      {/* Scale markers and labels below */}
                      <div className="relative mt-2">
                        <div className="flex justify-between text-gray-400">
                          {options.map((option) => (
                            <span key={option.id}>╹</span>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          {options.map((option, index) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => api.selection.single(option.id)}
                              className={`transition-all cursor-pointer ${
                                selectedIndex === index ? 'scale-105' : 'hover:scale-105'
                              }`}
                            >
                              <span
                                className={`text-sm transition-all whitespace-nowrap ${
                                  selectedIndex === index
                                    ? 'font-semibold text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                {option.value}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
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
          <div className="slider-field-edit">
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="mt-3 text-sm text-gray-600 mb-2">
              Options (each will be a point on the slider):
            </div>

            {options.map((option) => (
              <div key={option.id} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => api.option.update(option.id, e.target.value)}
                  placeholder={placeholder?.options || "Option label"}
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

export default SliderField;
