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
            <div className={`boolean-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light">{f.question || "Question"}</div>
                <div className="flex gap-2">
                  {(f.options || []).map((option) => {
                    const inputId = `${f.id}-${option.id}`;
                    const isSelected = f.selected === option.id;
                    const labelClasses = isSelected
                      ? "flex-1 flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer bg-[#0076a8] text-white border-[#0076a8]"
                      : "flex-1 flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer border-black/10 hover:bg-gray-50";
                    
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
                          className="hidden"
                        />
                        <span>{option.value}</span>
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
          <div className="boolean-field-edit">
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center px-4 my-1.5 shadow border border-black/10 rounded-lg">
                <input type="radio" name={`${f.fieldId}-edit`} disabled className="mr-2" />
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => api.option.update(opt.id, e.target.value)}
                  placeholder={placeholder?.options || `Option ${idx + 1}`}
                  className="w-full py-2"
                />
              </div>
            ))}
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default BooleanField;