import React from "react";
import { TRASHCANTWO_ICON, PLUSOPTION_ICON } from "../helper_shared/icons";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const MultiTextField = React.memo(function MultiTextField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder }) => {
        if (isPreview) {
          return (
            <div className="multitext-field-preview mie:text-mietext">
              <div className="mie:space-y-3 mie:pb-4">
                {f.question && <div className="mie:font-light mie:wrap-break-word mie:overflow-hidden">{f.question}</div>}
                <div className="mie:space-y-2 mie:w-full">
                  {(f.options || []).map((option) => (
                    <div key={option.id} className="mie:flex mie:flex-col mie:gap-1">
                      <label className="mie:text-xs mie:font-medium mie:text-mietextmuted mie:px-0 mie:text-left">{option.value}</label>
                      <input
                        type="text"
                        value={option.answer || ""}
                        onChange={(e) => api.option.updateAnswer(option.id, e.target.value)}
                        placeholder=""
                        className="mie:w-full mie:px-4 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors mie:min-w-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="multitext-field-edit mie:space-y-3">
            <div>
              <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
                Question
              </label>
              <input
                type="text"
                value={f.question || ""}
                onChange={(e) => api.field.update("question", e.target.value)}
                placeholder={placeholder?.question || "Enter question"}
                className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary mie:outline-none mie:transition-colors"
              />
            </div>

            <div>
              <label className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-2">
                Fields
              </label>
              <div className="mie:space-y-2">
                {(f.options || []).map((option) => (
                  <div key={option.id} className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors">
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => api.option.update(option.id, e.target.value)}
                      placeholder={placeholder?.options || "Field label"}
                      className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext"
                    />
                    <button 
                      onClick={() => api.option.remove(option.id)}
                      className="mie:shrink-0 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                      title="Remove field"
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
              <PLUSOPTION_ICON className="mie:w-5 mie:h-5" /> Add Field
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default MultiTextField;