import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import CustomRadio from "../helper_shared/CustomRadio";

const RatingField = React.memo(function RatingField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder }) => {
        const options = f.options || [];
        const selectedIndex = options.findIndex(opt => opt.id === f.selected);
        
        if (isPreview) {
          return (
            <div className="rating-field-preview mie:text-mietext">
              <div className={`mie:grid mie:gap-2 mie:pb-4 ${options.length > 5 ? 'mie:grid-cols-1' : 'mie:grid-cols-1 mie:lg:grid-cols-2'}`}>
                <div className="mie:font-light mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <div className="mie:py-2">
                  {options.length > 0 && (
                    <div className="mie:flex mie:flex-wrap mie:justify-evenly mie:gap-2">
                      {options.map((option, index) => {
                        const inputId = `${f.id}-${option.id}`;
                        const isSelected = selectedIndex === index;
                        const labelClasses = isSelected
                          ? "mie:flex mie:items-center mie:justify-center mie:min-w-[44px] mie:h-11 mie:px-3 mie:rounded-full mie:border-2 mie:transition-all mie:cursor-pointer mie:bg-mieprimary mie:text-miesurface mie:border-mieprimary mie:scale-105"
                          : "mie:flex mie:items-center mie:justify-center mie:min-w-[44px] mie:h-11 mie:px-3 mie:rounded-full mie:border-2 mie:transition-all mie:cursor-pointer mie:bg-miesurface mie:text-mietext mie:border-mieborder mie:hover:border-mieprimary/50 mie:hover:bg-mieprimary/10 mie:hover:scale-105";
                        
                        return (
                          <label
                            key={option.id}
                            htmlFor={inputId}
                            className={labelClasses}
                          >
                            <CustomRadio
                              id={inputId}
                              name={`rating-${f.id}`}
                              value={option.id}
                              checked={isSelected}
                              onSelect={() => api.selection.single(option.id)}
                              onUnselect={() => api.field.update("selected", null)}
                              hidden
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
                    <div className="mie:text-sm mie:text-mietextmuted mie:italic">No options available</div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="rating-field-edit mie:space-y-3">
            <input
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="mie:text-sm mie:text-mietextmuted">
              Options (each will be a rating button):
            </div>

            <div className="mie:space-y-2">
              {options.map((option) => (
                <div key={option.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors">
                  <div className="mie:w-3 mie:h-3 mie:rounded-full mie:bg-mieprimary mie:shrink-0" />
                  <input
                    type="text"
                    value={option.text || option.value}
                    onChange={(e) => api.option.update(option.id, { text: e.target.value, value: typeof option.value === 'number' ? option.value : e.target.value })}
                    placeholder={placeholder?.options || "Option label"}
                    className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext"
                  />
                  <button 
                    onClick={() => api.option.remove(option.id)}
                    className="mie:shrink-0 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                    title="Remove option"
                  >
                    <TRASHCANTWO_ICON className="mie:w-5 mie:h-5" />
                  </button>
                </div>
              ))}
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

export default RatingField;
