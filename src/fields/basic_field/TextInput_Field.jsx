import React from "react";
import FieldWrapper from "../shared/FieldWrapper";
import { useFieldController } from "../shared/useFieldController";

const TextInputField = React.memo(function TextInputField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview }) =>
        isPreview ? (
          <div className="p-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
              <div className="font-light">{field.question || "Question"}</div>
              <input
                type="text"
                value={field.answer || ""}
                onChange={(e) => api.field.update("answer", e.target.value)}
                placeholder="Type your answer"
                className="px-3 py-2 w-full border border-black/10 shadow-2xs rounded h-9"
              />
            </div>
          </div>
        ) : (
          <div className="p-4">
            <input
              className="px-3 py-2 w-full border border-black/40 rounded"
              type="text"
              value={field.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder="Enter question"
            />

            <input
              type="text"
              value={field.answer || ""}
              placeholder="Type your answer"
              className="px-3 my-1.5 w-full border border-black/10 shadow-2xs rounded h-10"
              disabled
            />
          </div>
        )
      }
    </FieldWrapper>
  );
});

export default TextInputField;
