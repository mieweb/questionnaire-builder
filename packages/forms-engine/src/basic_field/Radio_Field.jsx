import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import UnselectableRadio from "../helper_shared/UnselectableRadio";

const RadioField = React.memo(function RadioField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className="radio-field-preview">
              <div className="mie:grid mie:grid-cols-1 mie:gap-2 mie:sm:grid-cols-2 mie:pb-4">
                <div className="mie:font-light mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <div>
                  {(f.options || []).map((option) => {
                    const inputId = `${f.id}-${option.id}`;
                    const isSelected = f.selected === option.id;
                    
                    return (
                      <label
                        key={option.id}
                        htmlFor={inputId}
                        className="mie:flex mie:items-center mie:px-3 mie:py-2 mie:my-2 mie:cursor-pointer mie:rounded-lg mie:hover:bg-mieprimary/10 mie:transition-colors"
                      >
                        <UnselectableRadio
                          id={inputId}
                          name={`question-${f.id}`}
                          value={option.id}
                          checked={isSelected}
                          onSelect={() => api.selection.single(option.id)}
                          onUnselect={() => api.field.update("selected", null)}
                          className="mie:mr-2 mie:h-9 mie:w-9 mie:shrink-0 mie:cursor-pointer mie:accent-mieprimary mie:bg-miesurface"
                        />
                        <span className="mie:text-mietext">{option.value}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="radio-field-edit mie:space-y-3">
            <div>
              <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
                Question
              </label>
              <input
                type="text"
                value={f.question || ""}
                onChange={(e) => api.field.update("question", e.target.value)}
                placeholder={placeholder?.question || "Enter question"}
                className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary/30 mie:outline-none mie:transition-colors"
              />
            </div>

            <div>
              <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-2">
                Options
              </label>
              <div className="mie:space-y-2">
                {(f.options || []).map((option) => (
                  <div key={option.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors">
                    <span className="mie:shrink-0 mie:w-4 mie:h-4 mie:rounded-full mie:border mie:border-mieborder mie:bg-miesurface" />
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => api.option.update(option.id, e.target.value)}
                      placeholder={placeholder?.options || "Option text"}
                      className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext"
                    />
                    <button 
                      onClick={() => api.option.remove(option.id)}
                      className="mie:shrink-0 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                      title="Remove option"
                    >
                      <TRASHCANTWO_ICON className="mie:w-4 mie:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => api.option.add()} 
              className="mie:w-full mie:px-3 mie:py-2 mie:text-sm mie:font-medium mie:text-mieprimary mie:border mie:border-mieprimary/50 mie:rounded-lg mie:bg-miesurface mie:hover:bg-mieprimary/10 mie:transition-colors mie:flex mie:items-center mie:justify-center mie:gap-2"
            >
              <PLUSOPTION_ICON className="mie:w-5 mie:h-5" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default RadioField;
