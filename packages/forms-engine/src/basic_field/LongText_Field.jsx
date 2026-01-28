import React from "react";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const LongTextField = React.memo(function LongTextField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder, instanceId }) => {
        if (isPreview) {
          const inputId = `${instanceId}-longtext-${f.id}`;
          return (
            <div className="longtext-field-preview">
              <div className="mie:grid mie:grid-cols-1 mie:gap-2 mie:sm:grid-cols-2 mie:pb-4">
                <label htmlFor={inputId} className="mie:font-light mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</label>
                <textarea
                  id={inputId}
                  value={f.answer || ""}
                  onChange={(e) => api.field.update("answer", e.target.value)}
                  placeholder="Type your answer"
                  className="mie:px-3 mie:py-2 mie:h-24 mie:w-full mie:min-w-0 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:shadow-sm mie:rounded-lg mie:max-h-60 mie:resize-y mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary/30 mie:outline-none mie:transition-colors"
                  rows={4}
                />
              </div>
            </div>
          );
        }

        const questionInputId = `${instanceId}-longtext-question-${f.id}`;
        return (
          <div className="longtext-field-edit mie:space-y-2">
            <label htmlFor={questionInputId} className="mie:sr-only">Question</label>
            <input
              id={questionInputId}
              className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary/30 mie:outline-none mie:transition-colors"
              type="text"
              value={f.question || ""}
              onChange={(e) => api.field.update("question", e.target.value)}
              placeholder={placeholder?.question || "Enter question"}
            />

            <textarea
              value={f.answer || ""}
              placeholder={placeholder?.answer || "Type your answer"}
              className="mie:px-3 mie:py-2 mie:w-full mie:border mie:border-mieborder mie:shadow-sm mie:rounded-lg mie:min-h-24 mie:max-h-56 mie:resize-y mie:bg-miebackground mie:text-mietextmuted"
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