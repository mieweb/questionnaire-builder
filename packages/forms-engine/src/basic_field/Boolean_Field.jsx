import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";
import UnselectableRadio from "../helper_shared/UnselectableRadio";

const BooleanField = React.memo(function BooleanField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className={`boolean-field-preview ${insideSection ? "mie:border-b mie:border-gray-200" : "mie:border-0"}`}>
              <div className="mie:grid mie:grid-cols-1 mie:gap-2 mie:sm:grid-cols-2 mie:pb-4">
                <div className="mie:font-light mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <div className="mie:flex mie:gap-2">
                  {(f.options || []).map((option) => {
                    const inputId = `${f.id}-${option.id}`;
                    const isSelected = f.selected === option.id;
                    const labelClasses = isSelected
                      ? "mie:flex-1 mie:flex mie:items-center mie:justify-center mie:px-4 mie:py-2 mie:h-10 mie:border-2 mie:rounded-lg mie:cursor-pointer mie:bg-blue-600 mie:text-white mie:border-blue-600 mie:transition-all"
                      : "mie:flex-1 mie:flex mie:items-center mie:justify-center mie:px-4 mie:py-2 mie:h-10 mie:border-2 mie:rounded-lg mie:cursor-pointer mie:border-gray-300 mie:hover:bg-blue-50 mie:hover:border-blue-300 mie:transition-all";
                    
                    return (
                      <label
                        key={option.id}
                        htmlFor={inputId}
                        className={labelClasses}
                      >
                        <UnselectableRadio
                          id={inputId}
                          name={`question-${f.id}`}
                          value={option.id}
                          checked={isSelected}
                          onSelect={() => api.selection.single(option.id)}
                          onUnselect={() => api.field.update("selected", null)}
                          className="mie:hidden"
                        />
                        <span className={isSelected ? "mie:text-white" : "mie:text-gray-900"}>{option.value}</span>
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
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-gray-300 mie:rounded-lg mie:focus:border-blue-400 mie:focus:ring-1 mie:focus:ring-blue-400 mie:outline-none"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="mie:space-y-2">
            {options.map((opt) => (
              <div key={opt.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-gray-300 mie:rounded-lg mie:shadow-sm mie:hover:border-gray-400 mie:transition-colors">
                <input type="radio" name={`${f.fieldId}-edit`} checked={false} disabled className="mie:shrink-0" />
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => api.option.update(opt.id, e.target.value)}
                  placeholder={placeholder?.options || `Option ${opt.id}`}
                  className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent"
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