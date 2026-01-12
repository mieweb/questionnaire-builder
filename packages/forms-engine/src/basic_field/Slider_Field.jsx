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
              <div className={`slider-field-preview ${insideSection ? "mie:border-b mie:border-gray-200" : "mie:border-0"}`}>
              <div className={`mie:grid mie:gap-2 mie:pb-4 ${options.length > 5 ? 'mie:grid-cols-1' : 'mie:grid-cols-1 mie:sm:grid-cols-2'}`}>
                <div className="mie:font-light mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <div className="mie:py-2">
                  {options.length > 0 && (
                    <div className="mie:relative mie:pt-1">
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
                        className="mie:w-full mie:h-1 mie:bg-gray-200 mie:rounded-lg mie:appearance-none mie:cursor-pointer slider-thumb"
                      />
                      
                      {/* Scale markers and labels below */}
                      <div className="mie:relative mie:mt-2 mie:px-2">
                        <div className="mie:relative mie:h-4 mie:text-gray-400 mie:text-center">
                          {options.map((option, index) => {
                            const position = options.length > 1 ? (index / (options.length - 1)) * 100 : 50;
                            return (
                              <span
                                key={option.id}
                                className="mie:absolute"
                                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                              >
                                ╹
                              </span>
                            );
                          })}
                        </div>
                        <div className="mie:relative mie:mt-1">
                          {options.map((option, index) => {
                            const position = options.length > 1 ? (index / (options.length - 1)) * 100 : 50;
                            return (
                              <div
                                key={option.id}
                                className="mie:absolute"
                                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                              >
                                <button
                                  type="button"
                                  onClick={() => api.selection.single(option.id)}
                                  className="mie:cursor-pointer mie:focus:outline-none mie:whitespace-nowrap"
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
                    <div className="mie:text-sm mie:text-gray-400 mie:italic">No options available</div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="slider-field-edit mie:space-y-3">
            <input
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-gray-300 mie:rounded-lg mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="mie:text-sm mie:text-gray-600">
              Options (each will be a point on the slider):
            </div>

            <div className="mie:space-y-2">
              {options.map((option) => (
                <div key={option.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-gray-300 mie:rounded-lg mie:shadow-sm mie:hover:border-gray-400 mie:transition-colors">
                  <div className="mie:w-3 mie:h-3 mie:rounded-full mie:bg-blue-400 mie:shrink-0" />
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => api.option.update(option.id, e.target.value)}
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

export default SliderField;
