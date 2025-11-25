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
                      ? "flex-1 flex items-center justify-center px-4 py-2 border-2 rounded-lg cursor-pointer bg-blue-600 text-white border-blue-600 transition-all"
                      : "flex-1 flex items-center justify-center px-4 py-2 border-2 rounded-lg cursor-pointer border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-all";
                    
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
          <div className="boolean-field-edit space-y-2">
            <input
              className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <div className="space-y-2">
            {options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
                <input type="radio" name={`${f.fieldId}-edit`} disabled className="flex-shrink-0" />
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => api.option.update(opt.id, e.target.value)}
                  placeholder={placeholder?.options || `Option ${opt.id}`}
                  className="flex-1 min-w-0 outline-none bg-transparent"
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