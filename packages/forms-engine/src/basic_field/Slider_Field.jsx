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
                <div className="font-light wrap-break-word overflow-hidden">{f.question || "Question"}</div>
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
                      <div className="relative mt-2 px-2">
                        <div className="relative h-4 text-gray-400 text-center">
                          {options.map((option, index) => {
                            const position = options.length > 1 ? (index / (options.length - 1)) * 100 : 50;
                            const transform = index === 0 ? 'translateX(0)' : index === options.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)';
                            return (
                              <span
                                key={option.id}
                                className="absolute"
                                style={{ left: `${position}%`, transform }}
                              >
                                ╹
                              </span>
                            );
                          })}
                        </div>
                        <div className="relative mt-1">
                          {options.map((option, index) => {
                            const position = options.length > 1 ? (index / (options.length - 1)) * 100 : 50;
                            const transform = index === 0 ? 'translateX(0)' : index === options.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)';
                            return (
                              <div
                                key={option.id}
                                className="absolute"
                                style={{ left: `${position}%`, transform }}
                              >
                                <button
                                  type="button"
                                  onClick={() => api.selection.single(option.id)}
                                  className="cursor-pointer focus:outline-none whitespace-nowrap"
                                >
                                  <span
                                    className={`text-sm ${
                                      selectedIndex === index
                                        ? 'text-blue-600 font-semibold'
                                        : 'text-gray-500 hover:text-blue-600'
                                    }`}
                                  >
                                    {option.value}
                                  </span>
                                </button>
                              </div>
                            );
                          })}
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
          <div className="slider-field-edit space-y-3">
            <input
              className="px-3 py-2 h-10 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="text-sm text-gray-600">
              Options (each will be a point on the slider):
            </div>

            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
                  <div className="w-3 h-3 rounded-full bg-blue-400 shrink-0" />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => api.option.update(option.id, e.target.value)}
                    placeholder={placeholder?.options || "Option label"}
                    className="flex-1 min-w-0 outline-none bg-transparent"
                  />
                  <button 
                    onClick={() => api.option.remove(option.id)}
                    className="shrink-0 text-gray-400 hover:text-red-600 transition-colors"
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

export default SliderField;
