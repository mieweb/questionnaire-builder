import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const BooleanField = React.memo(function BooleanField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f }) => {
        const options = f.options?.length === 2 ? f.options : [
          { id: "yes", value: "Yes" },
          { id: "no", value: "No" }
        ];

        if (isPreview) {
          return (
            <div className={insideSection ? "border-b border-gray-200" : "border-0"}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light">{f.question || "Question"}</div>
                <div className="flex gap-2">
                  {options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer ${
                        f.selected === opt.id
                          ? "bg-[#0076a8] text-white border-[#0076a8]"
                          : "border-black/10 hover:bg-gray-50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (f.selected === opt.id) {
                          api.field.update("selected", null);
                        } else {
                          api.selection.single(opt.id);
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name={f.fieldId}
                        checked={f.selected === opt.id}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      <span>{opt.value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder="Enter question"
            />

            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center px-3 my-1.5 shadow border border-black/10 rounded-lg h-10">
                <input type="radio" name={`${f.fieldId}-edit`} disabled className="mr-2" />
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => api.option.update(idx, "value", e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="w-full"
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