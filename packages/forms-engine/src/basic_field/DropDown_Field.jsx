import React from "react";
import { PLUSOPTION_ICON, TRASHCANTWO_ICON } from "../helper_shared/icons";
import CustomDropdown from "../helper_shared/CustomDropdown";
import FieldWrapper from "../helper_shared/FieldWrapper";
import useFieldController from "../helper_shared/useFieldController";

const DropDownField = React.memo(function DropDownField({ field, sectionId }) {
  const ctrl = useFieldController(field, sectionId);

  return (
    <FieldWrapper ctrl={ctrl}>
      {({ api, isPreview, field: f, placeholder, instanceId }) => {
        if (isPreview) {
          return (
            <div className="dropdown-field-preview">
              <div className="mie:grid mie:grid-cols-1 mie:gap-2 mie:sm:grid-cols-2 mie:pb-4">
                <div className="mie:font-light mie:text-mietext mie:wrap-break-word mie:overflow-hidden">{f.question || "Question"}</div>
                <CustomDropdown
                  options={f.options || []}
                  value={f.selected || null}
                  onChange={(selectedId) => api.selection.single(selectedId)}
                  placeholder="Select an option"
                  showClearOption={true}
                />
              </div>
            </div>
          );
        }

        // ────────── Edit Mode ──────────
        return (
          <div className="dropdown-field-edit mie:space-y-3">
            <div>
              <span className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-1">
                Question
              </span>
              <input
                id={`${instanceId}-dropdown-question-${f.id}`}
                aria-label="Question"
                type="text"
                value={f.question || ""}
                onChange={(e) => api.field.update("question", e.target.value)}
                placeholder={placeholder?.question || "Enter question"}
                className="mie:px-3 mie:py-2 mie:h-10 mie:w-full mie:border mie:border-mieborder mie:bg-miesurface mie:text-mietext mie:rounded-lg mie:focus:border-mieprimary mie:focus:ring-1 mie:focus:ring-mieprimary/30 mie:outline-none mie:transition-colors"
              />
            </div>

            <div>
              <span className="mie:block mie:text-sm mie:font-medium mie:text-mietext mie:mb-2">
                Options
              </span>
              <div className="mie:space-y-2">
                {(f.options || []).map((option) => (
                  <div
                    key={option.id}
                    className="mie:flex mie:items-center mie:gap-2 mie:px-3 mie:py-2 mie:border mie:border-mieborder mie:bg-miesurface mie:rounded-lg mie:shadow-sm mie:hover:border-mietextmuted mie:transition-colors"
                  >
                    <input
                      id={`${instanceId}-dropdown-option-${f.id}-${option.id}`}
                      aria-label={`Option ${option.id}`}
                      type="text"
                      value={option.value}
                      onChange={(e) => api.option.update(option.id, e.target.value)}
                      placeholder={placeholder?.options || "Option text"}
                      className="mie:flex-1 mie:min-w-0 mie:outline-none mie:bg-transparent mie:text-mietext"
                    />
                    <button 
                      onClick={() => api.option.remove(option.id)}
                      className="mie:shrink-0 mie:text-mietextmuted mie:hover:text-miedanger mie:transition-colors mie:bg-transparent mie:border-0 mie:outline-none mie:focus:outline-none"
                      title="Remove option"
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
              <PLUSOPTION_ICON className="mie:w-5 mie:h-5" /> Add Option
            </button>
          </div>
        );
      }}
    </FieldWrapper>
  );
});

export default DropDownField;
