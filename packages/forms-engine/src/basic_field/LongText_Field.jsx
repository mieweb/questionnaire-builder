import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const LongTextField = React.memo(function LongTextField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, insideSection, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className={`longtext-field-preview ${insideSection ? "border-b border-gray-200" : "border-0"}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pb-4">
                <div className="font-light break-words overflow-hidden">{f.question || "Question"}</div>
                <textarea
                  value={f.answer || ""}
                  onChange={(e) => api.field.update("answer", e.target.value)}
                  placeholder="Type your answer"
                  className="px-3 py-2 h-24 w-full min-w-0 border border-gray-300 shadow-sm rounded-lg max-h-60 resize-y focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
                  rows={4}
                />
              </div>
            </div>
          );
        }

        return (
          <div className="longtext-field-edit space-y-2">
            <input
              className="px-3 py-2 h-10 w-full border border-gray-300 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-colors"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <textarea
              value={f.answer || ""}
              placeholder={placeholder?.answer || "Type your answer"}
              className="px-3 py-2 w-full border border-gray-300 shadow-sm rounded-lg min-h-24 max-h-56 resize-y bg-gray-50"
              rows={4}
              disabled
            />
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default LongTextField;