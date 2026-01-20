import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import CustomRadio from "../helper_shared/CustomRadio";

const BooleanField = React.memo(function BooleanField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className="boolean-field-preview">
              <div className="mie:grid mie:grid-cols-1 mie:gap-2 mie:sm:grid-cols-2 mie:pb-4">
                <div className="mie:font-light mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <div className="mie:flex mie:gap-2">
                  {(f.options || []).map((option) => {
                    const inputId = `${f.id}-${option.id}`;
                    const isSelected = f.selected === option.id;
                    
                    return (
                      <label
                        key={option.id}
                        htmlFor={inputId}
                        className={`mie:flex-1 mie:flex mie:items-center mie:justify-center mie:px-4 mie:py-2 mie:h-10 mie:border-2 mie:rounded-lg mie:cursor-pointer mie:transition-all ${
                          isSelected
                            ? "mie:bg-mieprimary mie:text-miesurface mie:border-mieprimary"
                            : "mie:border-mieborder mie:bg-miesurface mie:hover:bg-mieprimary/10 mie:hover:border-mieprimary/50"
                        }`}
                      >
                        <CustomRadio
                          id={inputId}
                          name={`question-${f.id}`}
                          value={option.id}
                          checked={isSelected}
                          onSelect={() => api.selection.single(option.id)}
                          onUnselect={() => api.field.update("selected", null)}
                          hidden
                        />
                        <span className={isSelected ? "mie:text-miesurface" : "mie:text-mietext"}>{option.value}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        const options = f.options?.length === 2 ? f.options : [
          { id: "yes", value: "Yes" },
          { id: "no", value: "No" }
        ];

        return (
          <div className="boolean-field-edit mie:space-y-2">
            <input
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary/30 mie:outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="mie:space-y-2">
            {options.map((opt) => (
              <div key={opt.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors">
                <span className="mie:shrink-0 mie:w-4 mie:h-4 mie:rounded-full mie:border mie:border-mieborder mie:bg-miesurface" />
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => api.option.update(opt.id, e.target.value)}
                  placeholder={placeholder?.options || `Option ${opt.id}`}
                  className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext"
                />
              </div>
            ))}
            </div>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default BooleanField;